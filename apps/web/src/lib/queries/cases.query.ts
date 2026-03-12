import { useQuery } from '@tanstack/react-query'
import { Case } from '@/types'
import { api } from '../api'

export const caseKeys = {
  all: ['cases'] as const,
  lists: () => [...caseKeys.all, 'list'] as const,
  list: (params?: string | { filters?: string; search?: string; status?: string; priority?: string; categoryId?: string; subcategoryId?: string }) =>
    [...caseKeys.lists(), { params }] as const,
  details: () => [...caseKeys.all, 'detail'] as const,
  detail: (id: string) => [...caseKeys.details(), id] as const,
}

export function useCasesQuery() {
  return useQuery<Case[]>({
    queryKey: caseKeys.list(),
    queryFn: async () => {
      const res = await api.cases.findAll()
      return res.data
    },
  })
}

export function useCaseQuery(id: string) {
  return useQuery<Case | null>({
    queryKey: caseKeys.detail(id),
    queryFn: async () => {
      const res = await api.cases.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useSearchCasesQuery(
  params?: string | { filters?: string; search?: string; limit?: string; status?: string; priority?: string; categoryId?: string; subcategoryId?: string },
  options?: any,
) {
  return useQuery<Case[]>({
    queryKey: caseKeys.list(params),
    queryFn: async () => {
      const res = await api.cases.search(params)
      return res.data
    },
    ...options,
  })
}
