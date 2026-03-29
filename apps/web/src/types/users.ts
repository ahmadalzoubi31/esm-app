import { Permission } from './permissions'
import { Role } from './roles'
import { Group } from './groups'
import { Department } from './department'

export const AuthSource = {
  LOCAL: 'local',
  LDAP: 'ldap',
} as const

export type AuthSource = (typeof AuthSource)[keyof typeof AuthSource]

export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email?: string
  displayName?: string
  avatar?: string
  authSource: AuthSource
  department?: Department
  phone?: string
  manager?: string
  password?: string
  externalId?: string
  isActive: boolean
  lastLoginAt?: Date
  isLicensed: boolean
  roles?: Role[]
  permissions?: Permission[]
  groups?: Group[]
  metadata?: UserMetadata
  createdAt: Date
  updatedAt: Date
}

export interface UserMetadata {
  mobile?: string
  title?: string
  company?: string
  employeeId?: string
  employeeType?: string
  location?: string
  city?: string
  state?: string
  country?: string
  userPrincipalName?: string
  [key: string]: any
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  username: string
  email?: string
  avatar?: string
  phone?: string
  manager?: string
  authSource: AuthSource
  department?: string
  externalId?: string
  password?: string
  isActive: boolean
  isLicensed: boolean
  metadata?: UserMetadata
  roles?: string[]
  permissions?: string[]
  groups?: string[]
}

export type UpdateUserDto = Partial<CreateUserDto>

export interface BulkUpdateUserDto {
  ids: string[]
  data: UpdateUserDto
}
