import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const sessionKeys = {
  all: ['sessions'] as const,
  list: () => [...sessionKeys.all, 'list'] as const,
}

export function useSessionsQuery() {
  return useQuery({
    queryKey: sessionKeys.list(),
    queryFn: async () => await api.session.getSessions(),
  })
}
