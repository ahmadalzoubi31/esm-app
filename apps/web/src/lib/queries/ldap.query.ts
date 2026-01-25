import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { LdapConfig, LdapSyncSchedule } from '@/schemas/settings/ldap.schema'
import { ApiResponse } from '@/types/api'

export const ldapKeys = {
  all: ['ldap'] as const,
  config: () => [...ldapKeys.all, 'config'] as const,
  schedule: () => [...ldapKeys.all, 'schedule'] as const,
  history: () => [...ldapKeys.all, 'history'] as const,
}

export function useLdapConfigQuery() {
  return useQuery<ApiResponse<LdapConfig>>({
    queryKey: ldapKeys.config(),
    queryFn: async () => await api.ldap.getConfig(),
  })
}

export function useLdapScheduleQuery() {
  return useQuery<ApiResponse<LdapSyncSchedule>>({
    queryKey: ldapKeys.schedule(),
    queryFn: async () => await api.ldap.getSchedule(),
  })
}

// export function useLdapHistoryQuery() {
//   return useQuery<ApiResponse<LdapSyncResult[]>>({
//     queryKey: ldapKeys.history(),
//     queryFn: async () => await api.ldap.getHistory(),
//   })
// }

export function useLdapSyncStatusQuery(jobId: string | null) {
  return useQuery({
    queryKey: [...ldapKeys.all, 'sync-status', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required')
      return await api.ldap.getSyncStatus(jobId)
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status
      if (status === 'completed' || status === 'failed') {
        return false
      }
      return 1000 // Poll every second
    },
  })
}
