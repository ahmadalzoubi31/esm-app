/**
 * Cases API
 */

import type { ApiResponse } from '@/types/api'
import type {
  CreateCaseDto,
  UpdateCaseDto,
  BulkUpdateCaseDto,
  Case,
} from '@/types/cases'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const casesApi = {
  findAll: async (): Promise<ApiResponse<Case[]>> => {
    return await apiFetch<Case[]>(API_ENDPOINTS.CASES.LIST, { method: 'GET' })
  },

  search: async (
    params?:
      | string
      | {
          filters?: string
          search?: string
          limit?: string
          status?: string
          priority?: string
          categoryId?: string
          subcategoryId?: string
        },
  ): Promise<ApiResponse<Case[]>> => {
    let url = API_ENDPOINTS.CASES.LIST
    const queryParams = new URLSearchParams()

    if (typeof params === 'string') {
      if (params) queryParams.append('filters', params)
    } else if (params) {
      if (params.filters) queryParams.append('filters', params.filters)
      if (params.search) queryParams.append('search', params.search)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.status) queryParams.append('status', params.status)
      if (params.priority) queryParams.append('priority', params.priority)
      if (params.categoryId) queryParams.append('categoryId', params.categoryId)
      if (params.subcategoryId) queryParams.append('subcategoryId', params.subcategoryId)
    }

    const queryString = queryParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    return await apiFetch<Case[]>(url, { method: 'GET' })
  },

  findOne: async (id: string): Promise<ApiResponse<Case>> => {
    return await apiFetch<Case>(API_ENDPOINTS.CASES.DETAIL(id), {
      method: 'GET',
    })
  },

  create: async (data: CreateCaseDto): Promise<ApiResponse<Case>> => {
    return await apiFetch<Case>(API_ENDPOINTS.CASES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    data: UpdateCaseDto,
  ): Promise<ApiResponse<Case>> => {
    return await apiFetch<Case>(API_ENDPOINTS.CASES.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.CASES.DELETE(id), {
      method: 'DELETE',
    })
  },

  deleteBulk: async (ids: string[]): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.CASES.BULK_DELETE, {
      method: 'DELETE',
      body: JSON.stringify(ids),
    })
  },
}
