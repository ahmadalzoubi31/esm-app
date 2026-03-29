import {
  CaseAssigneeUpdatedEvent,
  CaseBusinessLineUpdatedEvent,
  CaseCategoryUpdatedEvent,
  CaseCreatedEvent,
  CaseDeletedEvent,
  CaseGroupUpdatedEvent,
  CasePriorityUpdatedEvent,
  CaseServiceUpdatedEvent,
  CaseStatusUpdatedEvent,
  CaseSubcategoryUpdatedEvent,
} from '../../../esm/cases/events/case.events';
import {
  SlaBreachedEvent,
  SlaStatusUpdatedEvent,
  SlaWarningEvent,
} from '../../sla/events/sla.event';

export type TableAuditableEvent =
  | CaseCreatedEvent
  | CaseStatusUpdatedEvent
  | CaseAssigneeUpdatedEvent
  | CaseGroupUpdatedEvent
  | CasePriorityUpdatedEvent
  | CaseCategoryUpdatedEvent
  | CaseSubcategoryUpdatedEvent
  | CaseBusinessLineUpdatedEvent
  | CaseServiceUpdatedEvent
  | CaseDeletedEvent
  | SlaBreachedEvent
  | SlaWarningEvent
  | SlaStatusUpdatedEvent;
