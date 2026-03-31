import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  QueryOrder,
  RequiredEntityData,
} from '@mikro-orm/core';
import { SlaTarget } from './entities/sla-target.entity';
import { SlaTimer } from './entities/sla-timer.entity';
import { SlaRulesEngineService } from './sla-rules-engine.service';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { CreateSlaTargetDto } from './dto/create-target.dto';
import { UpdateSlaTargetDto } from './dto/update-target.dto';

@Injectable()
export class SlaService {
  private readonly logger = new Logger(SlaService.name);

  constructor(
    @InjectRepository(SlaTarget)
    private readonly targetRepo: EntityRepository<SlaTarget>,
    @InjectRepository(SlaTimer)
    private readonly timerRepo: EntityRepository<SlaTimer>,
    private readonly rulesEngine: SlaRulesEngineService,
  ) {}

  /**
   * Initialize SLA timers for a new case based on dynamic rules
   */
  async initForCase(caseRow: {
    id: string;
    businessLineId?: string;
    priority?: string;
    module?: string;
  }) {
    const em = this.targetRepo.getEntityManager();
    const targets = await this.targetRepo.find({ isActive: true });
    const now = new Date();

    if (targets.length === 0) {
      this.logger.warn(`No SLA targets found for case ${caseRow.id}`);
      return;
    }

    const results = {
      processed: 0,
      started: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const target of targets) {
      results.processed++;

      // Check existence to prevent duplicate timers
      const exists = await this.timerRepo.findOne({
        case: caseRow.id as any,
        target: target.id as any,
      });

      if (exists) {
        results.skipped++;
        continue;
      }

      const startTriggers = this.rulesEngine.findMatchingTriggers(
        target.rules,
        'case.created.sync',
        caseRow,
        'start',
      );

      if (startTriggers.length > 0) {
        const timer = this.timerRepo.create({
          case: caseRow.id as any,
          target: target.id as any,
          startedAt: now,
          lastTickAt: now,
          remainingMs: target.goalMs,
          status: 'Running',
          totalPausedMs: 0,
        } as RequiredEntityData<SlaTimer>);

        em.persist(timer); // Persist without flushing inside the loop for performance
        results.started++;
        this.logger.log(
          `Started SLA: Case ${caseRow.id}, Target ${target.type}`,
        );
      } else {
        const msg = `No start triggers: Case ${caseRow.id}, Target ${target.type}`;
        results.errors.push(msg);
        this.logger.warn(msg);
      }
    }

    await em.flush(); // Flush once after the loop
    return results;
  }

  async processSlaEvent(
    event: string,
    eventData: Record<string, unknown>,
    caseId: string,
  ) {
    const targets = await this.targetRepo.find({ isActive: true });

    if (targets.length === 0) return;

    for (const target of targets) {
      await this.processTargetForEvent(target, event, eventData, caseId);
    }
  }

  private async processTargetForEvent(
    target: SlaTarget,
    event: string,
    eventData: Record<string, unknown>,
    caseId: string,
  ) {
    const em = this.timerRepo.getEntityManager();
    const timer = await this.timerRepo.findOne({
      case: caseId as any,
      target: target.id as any,
    });

    if (!timer || ['Met', 'Stopped', 'Breached'].includes(timer.status)) {
      return;
    }

    const rules = target.rules;

    // 1. Check Stop Triggers
    const stopMatches = this.rulesEngine.findMatchingTriggers(
      rules,
      event,
      eventData,
      'stop',
    );
    if (stopMatches.length > 0) {
      return this.stopTimer(timer, 'Met', em);
    }

    // 2. Check Pause Triggers
    const pauseMatches = this.rulesEngine.findMatchingTriggers(
      rules,
      event,
      eventData,
      'pause',
    );
    if (pauseMatches.length > 0 && timer.status === 'Running') {
      return this.pauseTimer(timer, em);
    }

    // 3. Check Resume Triggers
    const resumeMatches = this.rulesEngine.findMatchingTriggers(
      rules,
      event,
      eventData,
      'resume',
    );
    if (resumeMatches.length > 0 && timer.status === 'Paused') {
      return this.resumeTimer(timer, em);
    }
  }

  private async stopTimer(timer: SlaTimer, status: 'Met' | 'Stopped', em: any) {
    timer.status = status;
    timer.stoppedAt = new Date();
    await em.flush();
  }

  private async pauseTimer(timer: SlaTimer, em: any) {
    timer.status = 'Paused';
    timer.pausedAt = new Date();
    await em.flush();
  }

  private async resumeTimer(timer: SlaTimer, em: any) {
    const now = new Date();
    if (timer.pausedAt) {
      timer.totalPausedMs += now.getTime() - timer.pausedAt.getTime();
    }
    timer.status = 'Running';
    timer.resumedAt = now;
    timer.pausedAt = undefined;
    await em.flush();
  }

  // --- Target Management ---

  async createTarget(dto: CreateSlaTargetDto) {
    const em = this.targetRepo.getEntityManager();
    const tenantFilter = em.getFilterParams('tenant');

    const target = this.targetRepo.create({
      ...dto,
      tenant: tenantFilter?.tenantId
        ? em.getReference(Tenant, tenantFilter.tenantId)
        : (undefined as unknown as Tenant),
    } as RequiredEntityData<SlaTarget>);

    await em.persist(target).flush();
    return target;
  }

  async listTargets() {
    return this.targetRepo.findAll({ orderBy: { name: QueryOrder.ASC } });
  }

  async getTarget(id: string) {
    return this.targetRepo.findOneOrFail({ id });
  }

  async updateTarget(id: string, dto: UpdateSlaTargetDto) {
    const target = await this.getTarget(id);
    this.targetRepo.assign(target, dto);
    await this.targetRepo.getEntityManager().flush();
    return target;
  }

  async removeTarget(id: string) {
    const target = await this.targetRepo.findOne({ id });
    if (target) await this.targetRepo.getEntityManager().removeAndFlush(target);
  }
}
