import { useQuery } from '@tanstack/react-query'
import { Category } from '@/types'
import { api } from '../api'

export const CategoryKeys = {
  all: ['categories'] as const,
  lists: () => [...CategoryKeys.all, 'list'] as const,
  list: (params?: string | { filters?: string; search?: string }) =>
    [...CategoryKeys.lists(), { params }] as const,
  details: () => [...CategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...CategoryKeys.details(), id] as const,
}

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: CategoryKeys.list(),
    queryFn: async () => {
      const res = await api.categories.findAll()
      return res.data
    },
  })
}

export function useCategoryQuery(id: string) {
  return useQuery<Category | null>({
    queryKey: CategoryKeys.detail(id),
    queryFn: async () => {
      const res = await api.categories.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useSearchCategoriesQuery(
  params?: string | { filters?: string; search?: string; limit?: string },
  options?: any,
) {
  return useQuery<Category[]>({
    queryKey: CategoryKeys.list(params),
    queryFn: async () => {
      const res = await api.categories.search(params)
      return res.data
    },
    ...options,
  })
}
