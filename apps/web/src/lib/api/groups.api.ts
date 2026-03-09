import type { ApiResponse } from '@/types/api'
import type {
  CreateGroupDto,
  UpdateGroupDto,
  BulkUpdateGroupDto,
  Group,
} from '@/types/groups'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const groupsApi = {
  findAll: async (): Promise<ApiResponse<Group[]>> => {
    return await apiFetch<Group[]>(API_ENDPOINTS.GROUPS.LIST, { method: 'GET' })
  },

  search: async (
    params?: string | { filters?: string; search?: string; limit?: string },
  ): Promise<ApiResponse<Group[]>> => {
    let url = API_ENDPOINTS.GROUPS.LIST
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

    return await apiFetch<Group[]>(url, { method: 'GET' })
  },

  findOne: async (id: string): Promise<ApiResponse<Group>> => {
    return await apiFetch<Group>(API_ENDPOINTS.GROUPS.DETAIL(id), {
      method: 'GET',
    })
  },

  create: async (data: CreateGroupDto): Promise<ApiResponse<Group>> => {
    return await apiFetch<Group>(API_ENDPOINTS.GROUPS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    data: UpdateGroupDto,
  ): Promise<ApiResponse<Group>> => {
    return await apiFetch<Group>(API_ENDPOINTS.GROUPS.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  remove: async (id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.GROUPS.DELETE(id), {
      method: 'DELETE',
    })
  },

  updateBulk: async (data: BulkUpdateGroupDto): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.GROUPS.BULK_UPDATE, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  deleteBulk: async (ids: string[]): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.GROUPS.BULK_DELETE, {
      method: 'DELETE',
      body: JSON.stringify(ids),
    })
  },
}
