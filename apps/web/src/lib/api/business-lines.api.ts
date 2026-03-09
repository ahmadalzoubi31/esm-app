import type { ApiResponse } from '@/types/api'
import type {
  BusinessLine,
  CreateBusinessLineDto,
  UpdateBusinessLineDto,
} from '@/types/business-lines'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const businessLinesApi = {
  findAll: async (): Promise<ApiResponse<BusinessLine[]>> => {
    return await apiFetch<BusinessLine[]>(API_ENDPOINTS.BUSINESS_LINES.LIST, {
      method: 'GET',
    })
  },

  findOne: async (id: string): Promise<ApiResponse<BusinessLine>> => {
    return await apiFetch<BusinessLine>(
      API_ENDPOINTS.BUSINESS_LINES.DETAIL(id),
      {
        method: 'GET',
      },
    )
  },

  create: async (
    data: CreateBusinessLineDto,
  ): Promise<ApiResponse<BusinessLine>> => {
    return await apiFetch<BusinessLine>(API_ENDPOINTS.BUSINESS_LINES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    data: UpdateBusinessLineDto,
  ): Promise<ApiResponse<BusinessLine>> => {
    return await apiFetch<BusinessLine>(
      API_ENDPOINTS.BUSINESS_LINES.UPDATE(id),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    )
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.BUSINESS_LINES.DELETE(id), {
      method: 'DELETE',
    })
  },
}
