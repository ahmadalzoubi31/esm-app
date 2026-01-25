import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { LdapConfig } from '@/schemas/settings/ldap.schema'
import { toast } from 'sonner'
import { ldapKeys } from '../queries/ldap.query'

export function useUpdateLdapConfigMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<LdapConfig>) => api.ldap.updateConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ldapKeys.config() })
      toast.success('LDAP configuration updated')
    },
    onError: () => {
      toast.error('Failed to update LDAP configuration')
    },
  })
}

export function useTestLdapConnectionMutation() {
  return useMutation({
    mutationFn: (data: Partial<LdapConfig>) => api.ldap.testConnection(data),
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success('Connection successful')
      } else {
        toast.error(`Connection failed: ${data.data.message}`)
      }
    },
    onError: () => {
      toast.error('Failed to test connection')
    },
  })
}

export function useLdapSyncMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.ldap.sync(),
    onSuccess: (data) => {
      // Don't invalidate here, let the caller handle it via polling completion
      toast.success('Sync started', {
        description: `Job ID: ${data.data.jobId}`,
      })
    },
    onError: () => {
      toast.error('Failed to start sync')
    },
  })
}

export function useLdapPreviewMutation() {
  return useMutation({
    mutationFn: (data: Partial<LdapConfig>) => api.ldap.preview(data),
    onError: () => {
      toast.error('Failed to fetch preview')
    },
  })
}

export function useUpdateLdapSyncScheduleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { syncEnabled: boolean; syncSchedule: string }) =>
      api.ldap.updateConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ldapKeys.config() })
      toast.success('Synchronization schedule updated')
    },
    onError: () => {
      toast.error('Failed to update synchronization schedule')
    },
  })
}
