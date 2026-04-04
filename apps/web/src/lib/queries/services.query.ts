import { useQuery } from '@tanstack/react-query'
import type { ServiceSchema } from '@repo/shared'
import { api } from '../api'

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: () => [...serviceKeys.lists()] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
}

export function useServicesQuery() {
  return useQuery<ServiceSchema[]>({
    queryKey: serviceKeys.list(),
    queryFn: async () => {
      const res = await api.services.findAll()
      return res.data
    },
  })
}

export function useServiceQuery(id: string) {
  return useQuery<ServiceSchema | null>({
    queryKey: serviceKeys.detail(id),
    queryFn: async () => {
      const res = await api.services.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}
