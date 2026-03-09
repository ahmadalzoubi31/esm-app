import { useQuery } from '@tanstack/react-query'
import { BusinessLine } from '@/types/business-lines'
import { api } from '../api'

export const businessLineKeys = {
  all: ['business-lines'] as const,
  lists: () => [...businessLineKeys.all, 'list'] as const,
  list: () => [...businessLineKeys.lists()] as const,
  details: () => [...businessLineKeys.all, 'detail'] as const,
  detail: (id: string) => [...businessLineKeys.details(), id] as const,
}

export function useBusinessLinesQuery() {
  return useQuery<BusinessLine[]>({
    queryKey: businessLineKeys.list(),
    queryFn: async () => {
      const res = await api.businessLines.findAll()
      return res.data
    },
  })
}

export function useBusinessLineQuery(id: string) {
  return useQuery<BusinessLine | null>({
    queryKey: businessLineKeys.detail(id),
    queryFn: async () => {
      const res = await api.businessLines.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}
