/**
 * Departments API
 * Department management endpoints
 */

import type { ApiResponse } from '@/types/api'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const departmentsApi = {
  /**
   * Get all departments with optional filters
   */
  findAll: async (filters?: string): Promise<ApiResponse<any[]>> => {
    const url = filters
      ? `${API_ENDPOINTS.DEPARTMENTS.LIST}?filters=${encodeURIComponent(filters)}`
      : API_ENDPOINTS.DEPARTMENTS.LIST

    return await apiFetch<any[]>(url, { method: 'GET' })
  },

  /**
   * Get a single department by ID
   */
  findOne: async (id: string): Promise<ApiResponse<any>> => {
    return await apiFetch<any>(API_ENDPOINTS.DEPARTMENTS.DETAIL(id), {
      method: 'GET',
    })
  },

  /**
   * Create a new department
   */
  create: async (data: any): Promise<ApiResponse<any>> => {
    return await apiFetch<any>(API_ENDPOINTS.DEPARTMENTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update an existing department
   */
  update: async (
    id: string,
    data: any,
  ): Promise<ApiResponse<any>> => {
    return await apiFetch<any>(API_ENDPOINTS.DEPARTMENTS.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete a department
   */
  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.DEPARTMENTS.DELETE(id), {
      method: 'DELETE',
    })
  },

  /**
   * Delete multiple departments at once
   */
  deleteBulk: async (ids: string[]): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.DEPARTMENTS.BULK_DELETE, {
      method: 'DELETE',
      body: JSON.stringify(ids),
    })
  },
}
