import { useQuery } from '@tanstack/react-query'
import { getProfileFn } from '@/server/auth.server'

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  refreshTokens: () => [...authKeys.all, 'refresh-tokens'] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
}

export function useProfileQuery() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => getProfileFn(),
  })
}
