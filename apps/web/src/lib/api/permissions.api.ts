/**
 * Permissions API
 * Permission management endpoints
 */

import type { ApiResponse } from '@/types/api'
import type {
  CreatePermissionDto,
  UpdatePermissionDto,
  AssignUserPermissionsDto,
  Permission,
} from '@/types/permissions'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const permissionsApi = {
  /**
   * Get all permissions with optional filters
   */
  findAll: async (filters?: string): Promise<ApiResponse<Permission[]>> => {
    // await new Promise((resolve) => setTimeout(resolve, 10000))
    const url = filters
      ? `${API_ENDPOINTS.PERMISSIONS.LIST}?filters=${encodeURIComponent(filters)}`
      : API_ENDPOINTS.PERMISSIONS.LIST

    return await apiFetch<Permission[]>(url, { method: 'GET' })
  },

  /**
   * Get a single permission by ID
   */
  findOne: async (id: string): Promise<ApiResponse<Permission>> => {
    return await apiFetch<Permission>(API_ENDPOINTS.PERMISSIONS.DETAIL(id), {
      method: 'GET',
    })
  },

  /**
   * Create a new permission
   */
  create: async (
    data: CreatePermissionDto,
  ): Promise<ApiResponse<Permission>> => {
    return await apiFetch<Permission>(API_ENDPOINTS.PERMISSIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update an existing permission
   */
  update: async (
    id: string,
    data: UpdatePermissionDto,
  ): Promise<ApiResponse<Permission>> => {
    return await apiFetch<Permission>(API_ENDPOINTS.PERMISSIONS.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a permission
   */
  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.PERMISSIONS.DELETE(id), {
      method: 'DELETE',
    })
  },

  /**
   * Assign permissions to a user
   */
  assignPermissionsToUser: async (
    userId: string,
    data: AssignUserPermissionsDto,
  ): Promise<ApiResponse<Boolean>> => {
    return await apiFetch<Boolean>(
      API_ENDPOINTS.PERMISSIONS.ASSIGN_TO_USER(userId),
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    )
  },

  /**
   * Remove permissions from a user
   */
  removePermissionsFromUser: async (
    userId: string,
    data: AssignUserPermissionsDto,
  ): Promise<ApiResponse<Boolean>> => {
    return await apiFetch<Boolean>(
      API_ENDPOINTS.PERMISSIONS.ASSIGN_TO_USER(userId),
      {
        method: 'DELETE',
        body: JSON.stringify(data),
      },
    )
  },
}
