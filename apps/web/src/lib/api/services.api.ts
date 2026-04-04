/**
 * Services API (Catalog)
 */

import type { ApiResponse } from '@/types/api'
import type { ServiceDto, ServiceSchema } from '@repo/shared'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const servicesApi = {
  findAll: async (): Promise<ApiResponse<ServiceSchema[]>> => {
    return await apiFetch<ServiceSchema[]>(API_ENDPOINTS.SERVICES.LIST, {
      method: 'GET',
    })
  },

  findOne: async (id: string): Promise<ApiResponse<ServiceSchema>> => {
    return await apiFetch<ServiceSchema>(API_ENDPOINTS.SERVICES.DETAIL(id), {
      method: 'GET',
    })
  },

  create: async (data: ServiceDto): Promise<ApiResponse<ServiceSchema>> => {
    return await apiFetch<ServiceSchema>(API_ENDPOINTS.SERVICES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    data: Partial<ServiceDto>,
  ): Promise<ApiResponse<ServiceSchema>> => {
    return await apiFetch<ServiceSchema>(API_ENDPOINTS.SERVICES.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.SERVICES.DELETE(id), {
      method: 'DELETE',
    })
  },
}
