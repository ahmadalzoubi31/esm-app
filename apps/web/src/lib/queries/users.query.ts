import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ApiResponse } from '@/types/api'
import { useServerFn } from '@tanstack/react-start'
import { getUserFn, getUsersFn, searchUsersFn } from '@/server/users.server'
import { User } from '@/types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: string | { filters?: string; search?: string }) =>
    [...userKeys.lists(), { params }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export function useUsersQuery() {
  const getUsers = useServerFn(getUsersFn)

  return useQuery<User[]>({
    queryKey: userKeys.list(),
    queryFn: async () => await getUsers(),
  })
}

export function useUserQuery(id: string) {
  const getUser = useServerFn(getUserFn)

  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: async () => await getUser({ data: { id } }),
    enabled: !!id,
  })
}

export function useSearchUsersQuery(
  params?: string | { filters?: string; search?: string },
  options?: any,
) {
  const searchUsers = useServerFn(searchUsersFn)

  return useQuery<User[]>({
    queryKey: userKeys.list(params),
    queryFn: async () => await searchUsers(),
    ...options,
  })
}
