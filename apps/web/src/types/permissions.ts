export interface CreatePermissionDto {
  key: string
  subject: string
  action: string
  category: string
  description?: string
  conditions?: Record<string, any>
}

export interface UpdatePermissionDto extends Partial<CreatePermissionDto> {}

export interface AssignUserPermissionsDto {
  permissionIds: string[]
}

export interface Permission {
  id: string
  key: string
  subject: string
  action: string
  category: string
  description?: string
  conditions?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
