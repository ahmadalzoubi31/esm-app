import { User } from './users'
import { Group } from './groups'
import { BusinessLine } from './business-lines'
import { CaseCategory } from './case-categories'
import { CaseSubcategory } from './case-subcategories'

export const CaseStatus = {
  NEW: 'NEW',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  CANCELED: 'CANCELED',
} as const

export type CaseStatus = (typeof CaseStatus)[keyof typeof CaseStatus]

export const CasePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const

export type CasePriority = (typeof CasePriority)[keyof typeof CasePriority]

export interface Case {
  id: string
  number: string
  title: string
  description?: string
  status: CaseStatus
  priority: CasePriority
  category: CaseCategory
  subcategory?: CaseSubcategory
  requester: User
  assignee?: User
  assignmentGroup: Group
  businessLine: BusinessLine
  affectedService?: any
  requestCard?: any
  createdAt: string
  updatedAt: string
}

export interface CreateCaseDto {
  title: string
  description?: string
  priority?: CasePriority
  status?: CaseStatus
  category_id: string
  subcategory_id?: string
  requester_id: string
  assignee_id?: string
  assignment_group_id: string
  business_line_id: string
  affected_service_id?: string
  request_card_id?: string
}

export type UpdateCaseDto = Partial<CreateCaseDto>

export interface BulkUpdateCaseDto {
  ids: string[]
  data: UpdateCaseDto
}
