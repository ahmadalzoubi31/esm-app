import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getProfileFn } from '@/server/auth.server'

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  refreshTokens: () => [...authKeys.all, 'refresh-tokens'] as const,
}

export const profileQueryOptions = queryOptions({
  queryKey: authKeys.profile(),
  queryFn: () => getProfileFn(),
  staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
})

export function useProfileQuery() {
  return useSuspenseQuery(profileQueryOptions)
}
