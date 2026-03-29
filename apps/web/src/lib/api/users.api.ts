/**
 * Users API
 * User management endpoints
 */

import type { ApiResponse } from '@/types/api'
import type {
  CreateUserDto,
  UpdateUserDto,
  BulkUpdateUserDto,
  User,
} from '@/types/users'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const usersApi = {
  /**
   * Get all users
   */
  findAll: async (): Promise<ApiResponse<User[]>> => {
    return await apiFetch<User[]>(API_ENDPOINTS.USERS.LIST, { method: 'GET' })
  },

  /**
   * Get all users with optional filters
   */
  search: async (
    params?:
      | string
      | {
          filters?: string
          search?: string
          limit?: string
          isLicensed?: boolean
        },
  ): Promise<ApiResponse<User[]>> => {
    let url = API_ENDPOINTS.USERS.LIST
    const queryParams = new URLSearchParams()

    if (typeof params === 'string') {
      if (params) queryParams.append('filters', params)
    } else if (params) {
      if (params.filters) queryParams.append('filters', params.filters)
      if (params.search) queryParams.append('search', params.search)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.isLicensed !== undefined)
        queryParams.append('isLicensed', String(params.isLicensed))
    }

    const queryString = queryParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    return await apiFetch<User[]>(url, { method: 'GET' })
  },

  /**
   * Get a single user by ID
   */
  findOne: async (id: string): Promise<ApiResponse<User>> => {
    return await apiFetch<User>(API_ENDPOINTS.USERS.DETAIL(id), {
      method: 'GET',
    })
  },

  /**
   * Create a new user
   */
  create: async (data: CreateUserDto): Promise<ApiResponse<User>> => {
    return await apiFetch<User>(API_ENDPOINTS.USERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update an existing user
   */
  update: async (
    id: string,
    data: UpdateUserDto,
  ): Promise<ApiResponse<User>> => {
    return await apiFetch<User>(API_ENDPOINTS.USERS.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a user
   */
  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.USERS.DELETE(id), {
      method: 'DELETE',
    })
  },

  /**
   * Update multiple users at once
   */
  updateBulk: async (data: BulkUpdateUserDto): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.USERS.BULK_UPDATE, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete multiple users at once
   */
  deleteBulk: async (ids: string[]): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.USERS.BULK_DELETE, {
      method: 'DELETE',
      body: JSON.stringify(ids),
    })
  },

  /**
   * Upload user avatar image
   */
  uploadAvatar: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData()
    formData.append('file', file)
    return await apiFetch<{ url: string }>(API_ENDPOINTS.USERS.UPLOAD_AVATAR, {
      method: 'POST',
      body: formData,
    })
  },
}

