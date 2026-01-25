import {
  LdapConfig,
  LdapSyncSchedule,
  LdapUserPreview,
} from '@/schemas/settings/ldap.schema'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'
import { ApiResponse } from '@/types/api'

export const ldapApi = {
  getConfig: async (): Promise<ApiResponse<LdapConfig>> => {
    return await apiFetch<LdapConfig>(API_ENDPOINTS.LDAP.CONFIG, {
      method: 'GET',
    })
  },

  updateConfig: async (
    data: Partial<LdapConfig>,
  ): Promise<ApiResponse<LdapConfig>> => {
    return await apiFetch<LdapConfig>(API_ENDPOINTS.LDAP.CONFIG, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // testConnection: async (
  //   data: Partial<LdapConfig>,
  // ): Promise<ApiResponse<LdapTestResult>> => {
  //   return await apiFetch<LdapTestResult>(API_ENDPOINTS.LDAP.TEST, {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   })
  // },

  getSchedule: async (): Promise<ApiResponse<LdapSyncSchedule>> => {
    return await apiFetch<LdapSyncSchedule>(API_ENDPOINTS.LDAP.SCHEDULE, {
      method: 'GET',
    })
  },

  updateSchedule: async (
    data: Partial<LdapSyncSchedule>,
  ): Promise<ApiResponse<LdapSyncSchedule>> => {
    return await apiFetch<LdapSyncSchedule>(API_ENDPOINTS.LDAP.SCHEDULE, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  sync: async (): Promise<ApiResponse<{ jobId: string }>> => {
    return await apiFetch<{ jobId: string }>(API_ENDPOINTS.LDAP.SYNC, {
      method: 'POST',
    })
  },

  getSyncStatus: async (
    jobId: string,
  ): Promise<
    ApiResponse<{
      jobId: string
      status: 'pending' | 'running' | 'completed' | 'failed'
      progress?: number
      startedAt?: string
      finishedAt?: string
      error?: string
    }>
  > => {
    return await apiFetch(API_ENDPOINTS.LDAP.SYNC_STATUS(jobId), {
      method: 'GET',
    })
  },

  // getHistory: async (): Promise<ApiResponse<LdapSyncResult[]>> => {
  //   return await apiFetch<LdapSyncResult[]>(API_ENDPOINTS.LDAP.HISTORY, {
  //     method: 'GET',
  //   })
  // },

  preview: async (
    data: Partial<LdapConfig>,
  ): Promise<ApiResponse<LdapUserPreview[]>> => {
    return await apiFetch<LdapUserPreview[]>(API_ENDPOINTS.LDAP.PREVIEW, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
