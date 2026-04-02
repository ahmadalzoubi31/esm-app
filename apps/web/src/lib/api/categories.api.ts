/**
 * Case Categories API
 */

import type { ApiResponse } from '@/types/api'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'
import { CategoryDto, CategorySchema } from '@repo/shared'

export const categoriesApi = {
  findAll: async (
    tier?: number,
    parentId?: string,
  ): Promise<ApiResponse<CategorySchema[]>> => {
    let url = API_ENDPOINTS.CATEGORIES.LIST
    const queryParams = new URLSearchParams()
    if (tier !== undefined) queryParams.append('tier', tier.toString())
    if (parentId !== undefined) queryParams.append('parentId', parentId)
    const queryString = queryParams.toString()
    if (queryString) url += `?${queryString}`

    return await apiFetch<CategorySchema[]>(url, {
      method: 'GET',
    })
  },

  search: async (
    params?:
      | string
      | {
          filters?: string
          search?: string
          limit?: string
        },
  ): Promise<ApiResponse<CategorySchema[]>> => {
    let url = API_ENDPOINTS.CATEGORIES.LIST
    const queryParams = new URLSearchParams()

    if (typeof params === 'string') {
      if (params) queryParams.append('filters', params)
    } else if (params) {
      if (params.filters) queryParams.append('filters', params.filters)
      if (params.search) queryParams.append('search', params.search)
      if (params.limit) queryParams.append('limit', params.limit)
    }

    const queryString = queryParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    return await apiFetch<CategorySchema[]>(url, { method: 'GET' })
  },

  findOne: async (id: string): Promise<ApiResponse<CategorySchema>> => {
    return await apiFetch<CategorySchema>(API_ENDPOINTS.CATEGORIES.DETAIL(id), {
      method: 'GET',
    })
  },

  create: async (data: CategoryDto): Promise<ApiResponse<CategorySchema>> => {
    return await apiFetch<CategorySchema>(API_ENDPOINTS.CATEGORIES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    data: CategoryDto,
  ): Promise<ApiResponse<CategorySchema>> => {
    return await apiFetch<CategorySchema>(API_ENDPOINTS.CATEGORIES.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.CATEGORIES.DELETE(id), {
      method: 'DELETE',
    })
  },

  deleteBulk: async (ids: string[]): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.CATEGORIES.BULK_DELETE, {
      method: 'DELETE',
      body: JSON.stringify(ids),
    })
  },
}
