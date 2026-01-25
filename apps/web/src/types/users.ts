import { Permission } from './permissions'
import { Role } from './roles'
import { Group } from './groups'

export const AuthSource = {
  LOCAL: 'local',
  LDAP: 'ldap',
} as const

export type AuthSource = (typeof AuthSource)[keyof typeof AuthSource]

export interface User {
  id: string
  first_name: string
  last_name: string
  username: string
  email?: string
  display_name?: string
  avatar?: string
  auth_source: AuthSource
  department?: string
  phone?: string
  manager?: string
  password?: string
  external_id?: string
  is_active: boolean
  last_login_at?: Date
  is_licensed: boolean
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
  first_name: string
  last_name: string
  username: string
  email?: string
  avatar?: string
  phone?: string
  manager?: string
  auth_source: AuthSource
  department?: string
  external_id?: string
  password?: string
  is_active: boolean
  is_licensed: boolean
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
