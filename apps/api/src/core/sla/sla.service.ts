import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { SlaTarget } from './entities/sla-target.entity';
import { SlaTimer } from './entities/sla-timer.entity';
import { SlaRulesEngineService } from './sla-rules-engine.service';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { SlaTargetDto } from '@repo/shared';

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
   * used in sla-case.listener.ts
   */
  async initForCase(caseRow: {
    id: string;
    businessLineId?: string;
    priority?: string;
    module?: string;
  }) {
    // 1: Get entity manager
    const em = this.targetRepo.getEntityManager();

    // 2: Find active SLA targets
    const where: any = { isActive: true };

    // 3: Find active SLA targets
    const targets = await this.targetRepo.find(where);

    // 4: Get current date and time
    const now = new Date();

    // 5: Check if any SLA targets were found
    if (targets.length === 0) {
      // 5.a: Log and return if no SLA targets were found
      this.logger.warn(`No SLA targets found for case ${caseRow.id}`);
      // 5.b: Return if no SLA targets were found
      return;
    }

    // 6: Initialize results
    const results = {
      processed: 0,
      started: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // 7: Process each SLA target
    for (const target of targets) {
      // 7.a: Increment processed count
      results.processed++;

      // 7.b: Check if timer already exists
      const exists = await this.timerRepo.findOne({
        case: caseRow.id,
        target: target.id,
      });

      // 7.c: Check if timer already exists
      if (exists) {
        // 7.c.i: Increment skipped count
        results.skipped++;
        // 7.c.ii: Continue to next target
        continue;
      }

      // 7.d: Find start triggers
      const startTriggers = this.rulesEngine.findMatchingTriggers(
        target.rules,
        'case.created.sync',
        caseRow,
        'start',
      );

      // 7.e: Check if start triggers match
      if (startTriggers.length > 0) {
        // 7.e.i: Create timer
        const timer = this.timerRepo.create({
          case: caseRow.id,
          target: target.id,
          startedAt: now,
          lastTickAt: now,
          remainingMs: target.goalMs,
          status: 'Running',
          createdAt: now,
          totalPausedMs: 0,
        });

        // 7.e.ii: Persist timer
        await em.persist(timer).flush();

        // 7.e.iii: Increment started count
        results.started++;
        // 7.e.iv: Log that timer was started
        this.logger.log(
          `Started SLA timer for case ${caseRow.id}, target ${target.type} (${target.goalMs}ms)`,
        );
      } else {
        // 7.f.i: Add error to results
        results.errors.push(
          `No start triggers found for case ${caseRow.id}, target ${target.type}`,
        );
        // 7.f.ii: Log that no start triggers were found
        this.logger.warn(
          `No start triggers found for case ${caseRow.id}, target ${target.type}`,
        );
      }
    }

    // 8: Log that SLA initialization completed
    this.logger.log(
      `SLA initialization completed for case ${caseRow.id}: ${results.started} started, ${results.skipped} skipped, ${results.errors.length} errors`,
    );

    // 9: Return results
    return results;
  }

  /**
   * Process SLA events dynamically based on rules
   * used in sla-case.listener.ts
   */
  async processSlaEvent(event: string, eventData: any, caseId: string) {
    // 1: Log event
    this.logger.log(
      `Processing SLA event: ${event} for case ${caseId}, event data: ${JSON.stringify(eventData)}`,
    );

    // 2: Find active SLA targets
    const where: any = { isActive: true };

    // 3: Find active SLA targets
    const targets = await this.targetRepo.find(where);

    // 4: Check if any SLA targets were found
    if (targets.length === 0) {
      // 4.a: Log and return if no SLA targets were found
      this.logger.warn(
        `No SLA targets found for event ${event}, case ${caseId}`,
      );
      // 4.b: Return if no SLA targets were found
      return;
    }

    // 5: Log that SLA targets were found
    this.logger.log(
      `Found ${targets.length} SLA targets for case ${caseId}, processing...`,
    );

    // 6: Process each SLA target
    for (const target of targets) {
      // 6.a: Process each SLA target
      await this.processTargetForEvent(target, event, eventData, caseId);
    }
  }

  /**
   * Process a specific target for an event (only for existing timers)
   * used in private method: processSlaEvent
   */
  private async processTargetForEvent(
    target: SlaTarget,
    event: string,
    eventData: any,
    caseId: string,
  ) {
    // 1: Get entity manager
    const em = this.timerRepo.getEntityManager();

    // 2: Find timer
    const timer = await this.timerRepo.findOne({
      case: caseId,
      target: target.id,
    });

    // 3: Check if timer exists
    if (!timer) {
      this.logger.debug(
        `No timer found for case ${caseId}, target ${target.type} - skipping event ${event}`,
      );
      // 3.a: Return if no timer found
      return;
    }

    // 4: Check if timer is in terminal state
    if (
      timer.status === 'Met' ||
      timer.status === 'Stopped' ||
      timer.status === 'Breached'
    ) {
      // 4.a: Log and return if timer is in terminal state
      this.logger.debug(
        `Timer already in terminal state (${timer.status}) for case ${caseId}, target ${target.type} - skipping`,
      );
      // 4.b: Return if timer is in terminal state
      return;
    }

    // 5: Process stop triggers
    const stopTriggers = this.rulesEngine.findMatchingTriggers(
      target.rules,
      event,
      eventData,
      'stop',
    );

    // 6: Check if stop triggers match
    if (
      stopTriggers.length > 0 &&
      (timer.status === 'Running' || timer.status === 'Paused')
    ) {
      // 6.a: Log stop trigger matched
      this.logger.log(
        `Stop trigger matched for case ${caseId}, target ${target.type}, event ${event}`,
      );
      // 6.b: Stop timer
      await this.stopTimer(timer, 'Met', em);
      // 6.c: Return if stop triggers match
      return;
    }

    // 7: Process pause triggers
    const pauseTriggers = this.rulesEngine.findMatchingTriggers(
      target.rules,
      event,
      eventData,
      'pause',
    );

    // 8: Check if pause triggers match
    if (pauseTriggers.length > 0 && timer.status === 'Running') {
      // 8.a: Log pause trigger matched
      this.logger.log(
        `Pause trigger matched for case ${caseId}, target ${target.type}, event ${event}`,
      );
      // 8.b: Pause timer
      await this.pauseTimer(timer, em);
      // 8.c: Return if pause triggers match
      return;
    }

    // 9: Process resume triggers
    const resumeTriggers = this.rulesEngine.findMatchingTriggers(
      target.rules,
      event,
      eventData,
      'resume',
    );

    // 10: Check if resume triggers match
    if (resumeTriggers.length > 0 && timer.status === 'Paused') {
      // 10.a: Log resume trigger matched
      this.logger.log(
        `Resume trigger matched for case ${caseId}, target ${target.type}, event ${event}`,
      );
      // 10.b: Resume timer
      await this.resumeTimer(timer, em);
      // 10.c: Return if resume triggers match
      return;
    }

    // 11: Log if no triggers matched
    this.logger.debug(
      `No triggers matched for case ${caseId}, target ${target.type}, event ${event}`,
    );
  }

  /**
   * Stop a timer
   * used in private method: processTargetForEvent
   */
  private async stopTimer(timer: SlaTimer, status: 'Met' | 'Stopped', em: any) {
    // 1: Update timer status
    timer.status = status;
    timer.stoppedAt = new Date();

    // 2: Flush
    await em.flush();

    // 3: Log
    this.logger.log(
      `SLA timer stopped for case ${timer.case.id}, target ${timer.target.id} - ${status}`,
    );
  }

  /**
   * Pause a timer
   * used in private method: processTargetForEvent
   */
  private async pauseTimer(timer: SlaTimer, em: any) {
    // 1: Update timer status
    timer.status = 'Paused';
    timer.pausedAt = new Date();

    // 2: Flush
    await em.flush();

    // 3: Log
    this.logger.log(
      `SLA timer paused for case ${timer.case.id}, target ${timer.target.id}`,
    );
  }

  /**
   * Resume a timer
   * used in private method: processTargetForEvent
   */
  private async resumeTimer(timer: SlaTimer, em: any) {
    // 1: Get current date
    const now = new Date();

    // 2: Calculate paused duration
    if (timer.pausedAt) {
      const pausedDuration = now.getTime() - timer.pausedAt.getTime();
      timer.totalPausedMs += pausedDuration;
    }

    // 3: Update timer status
    timer.status = 'Running';
    timer.resumedAt = now;
    timer.pausedAt = undefined;

    // 4: Flush
    await em.flush();

    // 5: Log
    this.logger.log(
      `SLA timer resumed for case ${timer.case.id}, target ${timer.target.id}`,
    );
  }

  /**
   * Create an SLA target
   * used in sla.controller.ts
   */
  async createTarget(dto: SlaTargetDto) {
    // 1: Get entity manager
    const em = this.targetRepo.getEntityManager();

    // 3: Get Tenant ID from Filter
    const tenantFilter = em.getFilterParams('tenant');

    // 3.1: Get Tenant Reference
    const tenantRef = em.getReference(Tenant, tenantFilter.tenantId);

    // 2: Create target
    const target = this.targetRepo.create({
      ...dto,
      tenant: tenantRef,
    });

    // 3: Persist and flush
    await em.persist(target).flush();

    // 4: Return target
    return target;
  }

  /**
   * List all SLA targets
   * used in sla.controller.ts
   */
  async listTargets() {
    // 1: Find all targets
    return await this.targetRepo.findAll({ orderBy: { name: 'ASC' } });
  }

  /**
   * Get an SLA target by ID
   * used in sla.controller.ts
   */
  async getTarget(id: string) {
    // 1: Find target
    return await this.targetRepo.findOneOrFail({ id });
  }

  /**
   * Update an SLA target
   * used in sla.controller.ts
   */
  async updateTarget(id: string, dto: SlaTargetDto) {
    // 1: Get entity manager
    const em = this.targetRepo.getEntityManager();

    // 2: Find target
    const target = await this.targetRepo.findOneOrFail({ id });

    // 3: Assign updates
    this.targetRepo.assign(target, dto);

    // 4: Flush
    await em.flush();

    // 5: Return target
    return target;
  }

  /**
   * Remove an SLA target
   * used in sla.controller.ts
   */
  async removeTarget(id: string) {
    // 1: Get entity manager
    const em = this.targetRepo.getEntityManager();

    // 2: Find target
    const target = await this.targetRepo.findOne({ id });

    // 3: Remove and flush
    if (target) await em.removeAndFlush(target);
  }
}
