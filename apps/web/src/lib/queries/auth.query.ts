import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}

export function useProfileQuery() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => await api.auth.getProfile(),
    select: (data) => data.data,
    retry: false, // Don't retry on auth failures
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  })
}
