/**
 * Roles API
 * Role management endpoints
 */

import type { ApiResponse } from '@/types/api'
import type {
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  AssignRolesDto,
  Role,
} from '@/types/roles'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'
import type { Permission } from '@/types'

export const rolesApi = {
  /**
   * Get all roles with optional filters
   */
  findAll: async (filters?: string): Promise<ApiResponse<Role[]>> => {
    // await new Promise((resolve) => setTimeout(resolve, 10000))
    const url = filters
      ? `${API_ENDPOINTS.ROLES.LIST}?filters=${encodeURIComponent(filters)}`
      : API_ENDPOINTS.ROLES.LIST

    return await apiFetch<Role[]>(url, { method: 'GET' })
  },

  /**
   * Get a single role by ID
   */
  findOne: async (id: string): Promise<ApiResponse<Role>> => {
    return await apiFetch<Role>(API_ENDPOINTS.ROLES.DETAIL(id), {
      method: 'GET',
    })
  },

  /**
   * Create a new role
   */
  create: async (data: CreateRoleDto): Promise<ApiResponse<Role>> => {
    return await apiFetch<Role>(API_ENDPOINTS.ROLES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update an existing role
   */
  update: async (
    id: string,
    data: UpdateRoleDto,
  ): Promise<ApiResponse<Role>> => {
    return await apiFetch<Role>(API_ENDPOINTS.ROLES.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a role
   */
  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.ROLES.DELETE(id), {
      method: 'DELETE',
    })
  },

  /**
   * Get permissions of a role
   */
  findPermissions: async (id: string): Promise<ApiResponse<Permission[]>> => {
    // Note: Assuming Permission type exists or will be generic.
    // Using any[] for now if not strictly defined, or importing generic type.
    // Ideally should be imported. I'll import ApiResponse and maybe define Permission if missing in types/roles
    return await apiFetch<any[]>(API_ENDPOINTS.ROLES.PERMISSIONS(id), {
      method: 'GET',
    })
  },

  /**
   * Assign permissions to a role
   */
  assignPermissions: async (
    id: string,
    data: AssignPermissionsDto,
  ): Promise<ApiResponse<Role>> => {
    return await apiFetch<Role>(API_ENDPOINTS.ROLES.PERMISSIONS(id), {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Remove permissions from a role
   */
  removePermissions: async (
    id: string,
    data: AssignPermissionsDto,
  ): Promise<ApiResponse<Role>> => {
    // DELETE request with body is generally supported but fetch API requires spec.
    // apiFetch wrapper handles separate init options.
    return await apiFetch<Role>(API_ENDPOINTS.ROLES.PERMISSIONS(id), {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  },

  /**
   * Assign roles to a user
   */
  assignRolesToUser: async (
    userId: string,
    data: AssignRolesDto,
  ): Promise<ApiResponse<Boolean>> => {
    return await apiFetch<Boolean>(API_ENDPOINTS.ROLES.ASSIGN_TO_USER(userId), {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Remove roles from a user
   */
  removeRolesFromUser: async (
    userId: string,
    data: AssignRolesDto,
  ): Promise<ApiResponse<Boolean>> => {
    return await apiFetch<Boolean>(API_ENDPOINTS.ROLES.ASSIGN_TO_USER(userId), {
      method: 'DELETE',
      body: JSON.stringify(data),
    })
  },
}
