/**
 * SLA API
 */

import type { ApiResponse } from '@/types/api'
import type { SlaTarget, CreateSlaTarget, UpdateSlaTarget } from '@/types/sla'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const slaApi = {
  findAll: async (): Promise<ApiResponse<SlaTarget[]>> => {
    return await apiFetch<SlaTarget[]>(API_ENDPOINTS.SLA.LIST, { method: 'GET' })
  },

  findOne: async (id: string): Promise<ApiResponse<SlaTarget>> => {
    return await apiFetch<SlaTarget>(API_ENDPOINTS.SLA.DETAIL(id), {
      method: 'GET',
    })
  },

  create: async (data: CreateSlaTarget): Promise<ApiResponse<SlaTarget>> => {
    return await apiFetch<SlaTarget>(API_ENDPOINTS.SLA.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    data: UpdateSlaTarget,
  ): Promise<ApiResponse<SlaTarget>> => {
    return await apiFetch<SlaTarget>(API_ENDPOINTS.SLA.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.SLA.DELETE(id), {
      method: 'DELETE',
    })
  },
}
