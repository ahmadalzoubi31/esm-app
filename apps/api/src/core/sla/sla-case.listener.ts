import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CASE_EVENTS } from '../../esm/cases/constants/case-events.constant';
import { CaseCreatedEvent } from '../../esm/cases/events/case.events';
import { SlaService } from './sla.service';

@Injectable()
export class SlaCaseListener {
  constructor(private readonly slaService: SlaService) {}

  @OnEvent(CASE_EVENTS.CREATED)
  handleCaseCreated(payload: CaseCreatedEvent) {
    return this.slaService.initForCase({
      id: payload.caseId,
      priority: payload.priority,
    });
  }

  @OnEvent(CASE_EVENTS.STATUS_UPDATED)
  handleCaseStatusUpdated(payload: {
    caseId: string;
    oldStatus: string;
    newStatus: string;
  }) {
    return this.slaService.processSlaEvent(
      CASE_EVENTS.STATUS_UPDATED,
      {
        status: payload.newStatus,
        from: payload.oldStatus,
        to: payload.newStatus,
      },
      payload.caseId,
    );
  }

  @OnEvent(CASE_EVENTS.ASSIGNEE_UPDATED)
  handleCaseAssigneeUpdated(payload: {
    caseId: string;
    oldAssigneeId: string;
    newAssigneeId: string;
  }) {
    return this.slaService.processSlaEvent(
      CASE_EVENTS.ASSIGNEE_UPDATED,
      payload,
      payload.caseId,
    );
  }

  @OnEvent(CASE_EVENTS.GROUP_UPDATED)
  handleCaseGroupUpdated(payload: {
    caseId: string;
    oldGroupId: string;
    newGroupId: string;
  }) {
    return this.slaService.processSlaEvent(
      CASE_EVENTS.GROUP_UPDATED,
      payload,
      payload.caseId,
    );
  }
}
