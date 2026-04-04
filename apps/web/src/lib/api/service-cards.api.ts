/**
 * Service Cards API (Catalog)
 */

import type { ApiResponse } from '@/types/api'
import type { ServiceCardDto, ServiceCardSchema } from '@repo/shared'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const serviceCardsApi = {
  findAll: async (): Promise<ApiResponse<ServiceCardSchema[]>> => {
    return await apiFetch<ServiceCardSchema[]>(API_ENDPOINTS.SERVICE_CARDS.LIST, {
      method: 'GET',
    })
  },

  findOne: async (id: string): Promise<ApiResponse<ServiceCardSchema>> => {
    return await apiFetch<ServiceCardSchema>(
      API_ENDPOINTS.SERVICE_CARDS.DETAIL(id),
      { method: 'GET' },
    )
  },

  create: async (
    data: ServiceCardDto,
  ): Promise<ApiResponse<ServiceCardSchema>> => {
    return await apiFetch<ServiceCardSchema>(API_ENDPOINTS.SERVICE_CARDS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    data: Partial<ServiceCardDto>,
  ): Promise<ApiResponse<ServiceCardSchema>> => {
    return await apiFetch<ServiceCardSchema>(
      API_ENDPOINTS.SERVICE_CARDS.UPDATE(id),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    )
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.SERVICE_CARDS.DELETE(id), {
      method: 'DELETE',
    })
  },
}
