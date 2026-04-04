import { useQuery } from '@tanstack/react-query'
import type { ServiceCardSchema } from '@repo/shared'
import { api } from '../api'

export const serviceCardKeys = {
  all: ['service-cards'] as const,
  lists: () => [...serviceCardKeys.all, 'list'] as const,
  list: () => [...serviceCardKeys.lists()] as const,
  details: () => [...serviceCardKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceCardKeys.details(), id] as const,
}

export function useServiceCardsQuery() {
  return useQuery<ServiceCardSchema[]>({
    queryKey: serviceCardKeys.list(),
    queryFn: async () => {
      const res = await api.serviceCards.findAll()
      return res.data
    },
  })
}

export function useServiceCardQuery(id: string) {
  return useQuery<ServiceCardSchema | null>({
    queryKey: serviceCardKeys.detail(id),
    queryFn: async () => {
      const res = await api.serviceCards.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}
