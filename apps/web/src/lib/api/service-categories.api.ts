/**
 * Service Categories API (Catalog)
 */

import type { ApiResponse } from '@/types/api'
import type { ServiceCategoryDto, ServiceCategorySchema } from '@repo/shared'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const serviceCategoriesApi = {
  findAll: async (): Promise<ApiResponse<ServiceCategorySchema[]>> => {
    return await apiFetch<ServiceCategorySchema[]>(
      API_ENDPOINTS.SERVICE_CATEGORIES.LIST,
      { method: 'GET' },
    )
  },

  findOne: async (id: string): Promise<ApiResponse<ServiceCategorySchema>> => {
    return await apiFetch<ServiceCategorySchema>(
      API_ENDPOINTS.SERVICE_CATEGORIES.DETAIL(id),
      { method: 'GET' },
    )
  },

  create: async (
    data: ServiceCategoryDto,
  ): Promise<ApiResponse<ServiceCategorySchema>> => {
    return await apiFetch<ServiceCategorySchema>(
      API_ENDPOINTS.SERVICE_CATEGORIES.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    )
  },

  update: async (
    id: string,
    data: ServiceCategoryDto,
  ): Promise<ApiResponse<ServiceCategorySchema>> => {
    return await apiFetch<ServiceCategorySchema>(
      API_ENDPOINTS.SERVICE_CATEGORIES.UPDATE(id),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    )
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.SERVICE_CATEGORIES.DELETE(id), {
      method: 'DELETE',
    })
  },
}
