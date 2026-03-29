import { CASE_EVENTS } from '../constants/case-events.constant';

export class CaseCreatedEvent {
  caseId: string;
  businessLineId: string;
  priority: string;
  status: string;
  readonly _event = CASE_EVENTS.CREATED;

  constructor(partial: Partial<CaseCreatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CaseStatusUpdatedEvent {
  caseId: string;
  oldStatus: string;
  newStatus: string;
  readonly _event = CASE_EVENTS.STATUS_UPDATED;

  constructor(partial: Partial<CaseStatusUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CaseAssigneeUpdatedEvent {
  caseId: string;
  oldAssigneeId?: string;
  newAssigneeId: string;
  readonly _event = CASE_EVENTS.ASSIGNEE_UPDATED;

  constructor(partial: Partial<CaseAssigneeUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CaseGroupUpdatedEvent {
  caseId: string;
  oldGroupId?: string;
  newGroupId: string;
  readonly _event = CASE_EVENTS.GROUP_UPDATED;

  constructor(partial: Partial<CaseGroupUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CasePriorityUpdatedEvent {
  caseId: string;
  oldPriority: string;
  newPriority: string;
  readonly _event = CASE_EVENTS.PRIORITY_UPDATED;

  constructor(partial: Partial<CasePriorityUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CaseCategoryUpdatedEvent {
  caseId: string;
  oldCategoryId: string;
  newCategoryId: string;
  readonly _event = CASE_EVENTS.CATEGORY_UPDATED;

  constructor(partial: Partial<CaseCategoryUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CaseSubcategoryUpdatedEvent {
  caseId: string;
  oldSubcategoryId: string;
  newSubcategoryId: string;
  readonly _event = CASE_EVENTS.SUBCATEGORY_UPDATED;

  constructor(partial: Partial<CaseSubcategoryUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CaseBusinessLineUpdatedEvent {
  caseId: string;
  oldBusinessLineId: string;
  newBusinessLineId: string;
  readonly _event = CASE_EVENTS.BUSINESS_LINE_UPDATED;

  constructor(partial: Partial<CaseBusinessLineUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CaseServiceUpdatedEvent {
  caseId: string;
  oldServiceId?: string;
  newServiceId: string;
  readonly _event = CASE_EVENTS.SERVICE_UPDATED;

  constructor(partial: Partial<CaseServiceUpdatedEvent>) {
    Object.assign(this, partial);
  }
}

export class CaseDeletedEvent {
  caseId: string;
  number: string;
  readonly _event = CASE_EVENTS.DELETED;

  constructor(partial: Partial<CaseDeletedEvent>) {
    Object.assign(this, partial);
  }
}
