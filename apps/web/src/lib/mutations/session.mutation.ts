import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { sessionKeys } from '../queries/session.query'

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sessionId: number) =>
      await api.session.revokeSession(sessionId),
    onSuccess: () => {
      toast.success('Session revoked successfully')
      queryClient.invalidateQueries({ queryKey: sessionKeys.list() })
    },
    onError: () => {
      toast.error('Failed to revoke session')
    },
  })
}
