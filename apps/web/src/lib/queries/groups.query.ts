import { useQuery } from '@tanstack/react-query'
import { Group } from '@/types/groups'
import { api } from '../api'

export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (params?: string | { filters?: string; search?: string }) =>
    [...groupKeys.lists(), { params }] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const,
}

export function useGroupsQuery() {
  return useQuery<Group[]>({
    queryKey: groupKeys.list(),
    queryFn: async () => {
      const res = await api.groups.findAll()
      return res.data
    },
  })
}

export function useGroupQuery(id: string) {
  return useQuery<Group | null>({
    queryKey: groupKeys.detail(id),
    queryFn: async () => {
      const res = await api.groups.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useSearchGroupsQuery(
  params?: string | { filters?: string; search?: string; limit?: string },
  options?: any,
) {
  return useQuery<Group[]>({
    queryKey: groupKeys.list(params),
    queryFn: async () => {
      const res = await api.groups.search(params)
      return res.data
    },
    ...options,
  })
}
