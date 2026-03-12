import { useQuery } from '@tanstack/react-query'
import { CaseSubcategory } from '@/types'
import { api } from '../api'

export const caseSubcategoryKeys = {
  all: ['caseSubcategories'] as const,
  lists: () => [...caseSubcategoryKeys.all, 'list'] as const,
  list: (params?: string | { filters?: string; search?: string; categoryId?: string }) =>
    [...caseSubcategoryKeys.lists(), { params }] as const,
  details: () => [...caseSubcategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...caseSubcategoryKeys.details(), id] as const,
}

export function useCaseSubcategoriesQuery() {
  return useQuery<CaseSubcategory[]>({
    queryKey: caseSubcategoryKeys.list(),
    queryFn: async () => {
      const res = await api.caseSubcategories.findAll()
      return res.data
    },
  })
}

export function useCaseSubcategoryQuery(id: string) {
  return useQuery<CaseSubcategory | null>({
    queryKey: caseSubcategoryKeys.detail(id),
    queryFn: async () => {
      const res = await api.caseSubcategories.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useSearchCaseSubcategoriesQuery(
  params?: string | { filters?: string; search?: string; limit?: string; categoryId?: string },
  options?: any,
) {
  return useQuery<CaseSubcategory[]>({
    queryKey: caseSubcategoryKeys.list(params),
    queryFn: async () => {
      const res = await api.caseSubcategories.search(params)
      return res.data
    },
    ...options,
  })
}
