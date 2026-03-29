import { User } from './users'
import { Group } from './groups'
import { BusinessLine } from './business-lines'
import { Category } from './categories'
import {
  Circle,
  UserCheck,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowDownCircle,
  ArrowRightCircle,
  ArrowUpCircle,
} from 'lucide-react'

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

export const CASE_STATUS_OPTIONS = [
  { label: 'New', value: CaseStatus.NEW, icon: Circle, color: 'text-blue-500' },
  {
    label: 'Waiting for Approval',
    value: CaseStatus.WAITING_FOR_APPROVAL,
    icon: UserCheck,
    color: 'text-yellow-500',
  },
  {
    label: 'Pending',
    value: CaseStatus.PENDING,
    icon: Clock,
    color: 'text-orange-500',
  },
  {
    label: 'In Progress',
    value: CaseStatus.IN_PROGRESS,
    icon: PlayCircle,
    color: 'text-indigo-500',
  },
  {
    label: 'Resolved',
    value: CaseStatus.RESOLVED,
    icon: CheckCircle2,
    color: 'text-green-500',
  },
  {
    label: 'Closed',
    value: CaseStatus.CLOSED,
    icon: CheckCircle2,
    color: 'text-gray-500',
  },
  {
    label: 'Canceled',
    value: CaseStatus.CANCELED,
    icon: XCircle,
    color: 'text-red-500',
  },
]

export const CasePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const

export type CasePriority = (typeof CasePriority)[keyof typeof CasePriority]

export const CASE_PRIORITY_OPTIONS = [
  {
    label: 'Low',
    value: CasePriority.LOW,
    icon: ArrowDownCircle,
    color: 'text-blue-500',
  },
  {
    label: 'Medium',
    value: CasePriority.MEDIUM,
    icon: ArrowRightCircle,
    color: 'text-green-500',
  },
  {
    label: 'High',
    value: CasePriority.HIGH,
    icon: ArrowUpCircle,
    color: 'text-orange-500',
  },
  {
    label: 'Critical',
    value: CasePriority.CRITICAL,
    icon: AlertOctagon,
    color: 'text-red-500',
  },
]

export interface Case {
  id: string
  number: string
  title: string
  description?: string
  status: CaseStatus
  priority: CasePriority
  category: Category
  subcategory?: Category
  requester: User
  assignee?: User
  assignmentGroup: Group
  businessLine: BusinessLine
  affectedService: any // Required in Entity
  requestCard?: any
  comments: CaseComment[]
  attachments: CaseAttachment[]
  createdAt: string
  updatedAt: string
}

export interface CreateCaseDto {
  title: string
  description?: string
  priority?: CasePriority
  status?: CaseStatus
  categoryId: string
  subcategoryId?: string
  requesterId: string
  assigneeId?: string
  assignmentGroupId: string
  businessLineId: string
  affectedServiceId: string // Required in Entity
  requestCardId?: string
}

export type UpdateCaseDto = Partial<CreateCaseDto>

export interface BulkUpdateCaseDto {
  ids: string[]
  data: UpdateCaseDto
}

export interface CaseComment {
  id: string
  body: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCaseCommentDto {
  body: string
  isPrivate: boolean
}

export interface CreateCaseAttachmentDto {
  filename: string
  originalName: string
  mimeType: string
  size: number
  storagePath: string
}

export interface CaseAttachment {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  storagePath: string
  createdAt: string
  updatedAt: string
}
