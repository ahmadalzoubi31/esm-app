import { useQuery } from '@tanstack/react-query'
import { CaseCategory } from '@/types'
import { api } from '../api'

export const caseCategoryKeys = {
  all: ['caseCategories'] as const,
  lists: () => [...caseCategoryKeys.all, 'list'] as const,
  list: (params?: string | { filters?: string; search?: string }) =>
    [...caseCategoryKeys.lists(), { params }] as const,
  details: () => [...caseCategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...caseCategoryKeys.details(), id] as const,
}

export function useCaseCategoriesQuery() {
  return useQuery<CaseCategory[]>({
    queryKey: caseCategoryKeys.list(),
    queryFn: async () => {
      const res = await api.caseCategories.findAll()
      return res.data
    },
  })
}

export function useCaseCategoryQuery(id: string) {
  return useQuery<CaseCategory | null>({
    queryKey: caseCategoryKeys.detail(id),
    queryFn: async () => {
      const res = await api.caseCategories.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useSearchCaseCategoriesQuery(
  params?: string | { filters?: string; search?: string; limit?: string },
  options?: any,
) {
  return useQuery<CaseCategory[]>({
    queryKey: caseCategoryKeys.list(params),
    queryFn: async () => {
      const res = await api.caseCategories.search(params)
      return res.data
    },
    ...options,
  })
}
