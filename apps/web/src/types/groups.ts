import { BusinessLine } from './business-lines'
import { User, Role, Permission } from './index'

export interface Group {
  id: string
  name: string
  type: string
  description?: string
  teamLeader?: User
  businessLine: BusinessLine
  roles?: Role[]
  permissions?: Permission[]
  users?: User[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateGroupDto {
  name: string
  type: string
  description?: string
  teamLeaderId?: string
  businessLineId: string
  roles?: string[]
  permissions?: string[]
  users?: string[]
}

export type UpdateGroupDto = Partial<CreateGroupDto>

export interface BulkUpdateGroupDto {
  ids: string[]
  data: UpdateGroupDto
}
