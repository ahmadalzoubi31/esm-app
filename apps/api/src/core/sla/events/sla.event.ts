import { SlaEventEnum } from '@repo/shared';

export class SlaBreachedEvent {
  caseId: string;
  targetId: string;
  type: string;
  at: string;
  readonly _event = SlaEventEnum['sla.breached'];

  constructor(partial: Partial<SlaBreachedEvent>) {
    Object.assign(this, partial);
  }
}

export class SlaWarningEvent {
  caseId: string;
  targetId: string;
  type: string;
  at: string;
  readonly _event = SlaEventEnum['sla.warning'];

  constructor(partial: Partial<SlaWarningEvent>) {
    Object.assign(this, partial);
  }
}

export class SlaStatusUpdatedEvent {
  caseId: string;
  targetId: string;
  oldStatus: string;
  newStatus: string;
  at: string;
  readonly _event: string;

  constructor(partial: Partial<SlaStatusUpdatedEvent>) {
    Object.assign(this, partial);
  }
}
