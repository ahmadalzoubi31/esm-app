/**
 * Case Subcategories API
 */

import type { ApiResponse } from '@/types/api'
import type {
  CreateCaseSubcategoryDto,
  UpdateCaseSubcategoryDto,
  CaseSubcategory,
} from '@/types/case-subcategories'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const caseSubcategoriesApi = {
  findAll: async (): Promise<ApiResponse<CaseSubcategory[]>> => {
    return await apiFetch<CaseSubcategory[]>(API_ENDPOINTS.CASE_SUBCATEGORIES.LIST, { method: 'GET' })
  },

  search: async (
    params?:
      | string
      | {
          filters?: string
          search?: string
          limit?: string
          categoryId?: string
        },
  ): Promise<ApiResponse<CaseSubcategory[]>> => {
    let url = API_ENDPOINTS.CASE_SUBCATEGORIES.LIST
    const queryParams = new URLSearchParams()

    if (typeof params === 'string') {
      if (params) queryParams.append('filters', params)
    } else if (params) {
      if (params.filters) queryParams.append('filters', params.filters)
      if (params.search) queryParams.append('search', params.search)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.categoryId) queryParams.append('categoryId', params.categoryId)
    }

    const queryString = queryParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    return await apiFetch<CaseSubcategory[]>(url, { method: 'GET' })
  },

  findOne: async (id: string): Promise<ApiResponse<CaseSubcategory>> => {
    return await apiFetch<CaseSubcategory>(API_ENDPOINTS.CASE_SUBCATEGORIES.DETAIL(id), {
      method: 'GET',
    })
  },

  create: async (data: CreateCaseSubcategoryDto): Promise<ApiResponse<CaseSubcategory>> => {
    return await apiFetch<CaseSubcategory>(API_ENDPOINTS.CASE_SUBCATEGORIES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    data: UpdateCaseSubcategoryDto,
  ): Promise<ApiResponse<CaseSubcategory>> => {
    return await apiFetch<CaseSubcategory>(API_ENDPOINTS.CASE_SUBCATEGORIES.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.CASE_SUBCATEGORIES.DELETE(id), {
      method: 'DELETE',
    })
  },

  deleteBulk: async (ids: string[]): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.CASE_SUBCATEGORIES.BULK_DELETE, {
      method: 'DELETE',
      body: JSON.stringify(ids),
    })
  },
}
