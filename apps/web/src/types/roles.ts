export interface CreateRoleDto {
  name: string
  description?: string
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {}

export interface AssignPermissionsDto {
  permissionIds: string[]
}

export interface AssignRolesDto {
  roleIds: string[]
}

export interface Role {
  id: string
  key: string
  name: string
  description?: string
  permissionCount: number
  userCount: number
  createdAt: Date
  updatedAt: Date
}
