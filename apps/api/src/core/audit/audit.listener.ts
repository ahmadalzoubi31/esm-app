import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditService } from './audit.service';
import { TableAuditableEvent } from './types/audit.types';

@Injectable()
export class AuditListener {
  private readonly logger = new Logger(AuditListener.name);

  constructor(private readonly auditService: AuditService) {}

  /**
   * Wildcard listener — captures ALL case.* events
   * e.g., case.created, case.status.updated, case.assignee.updated, case.group.updated
   */
  @OnEvent('case.*')
  async onCaseEvent(payload: TableAuditableEvent) {
    if (!payload?.caseId) return;

    this.logger.debug(`Audit: capturing case event for case ${payload.caseId}`);

    await this.auditService.log({
      entityType: 'case',
      entityId: payload.caseId,
      event: (payload._event as string) ?? 'case.event',
      payload,
    });
  }

  /**
   * Wildcard listener — captures ALL sla.* events
   * e.g., sla.breached
   */
  @OnEvent('sla.*')
  async onSlaEvent(payload: TableAuditableEvent) {
    if (!payload?.caseId) return;

    this.logger.debug(`Audit: capturing SLA event for case ${payload.caseId}`);

    await this.auditService.log({
      entityType: 'sla',
      entityId: payload.caseId,
      event: (payload._event as string) ?? 'sla.event',
      payload,
    });
  }
}
