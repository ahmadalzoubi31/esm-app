import { useQuery } from '@tanstack/react-query'
import { User } from '@/types'
import { api } from '../api'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: string | { filters?: string; search?: string }) =>
    [...userKeys.lists(), { params }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: userKeys.list(),
    queryFn: async () => {
      const res = await api.users.findAll()
      return res.data
    },
  })
}

export function useUserQuery(id: string) {
  return useQuery<User | null>({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const res = await api.users.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useSearchUsersQuery(
  params?:
    | string
    | {
        filters?: string
        search?: string
        limit?: string
        isLicensed?: boolean
      },
  options?: any,
) {
  return useQuery<User[]>({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const res = await api.users.search(params)
      return res.data
    },
    ...options,
  })
}

