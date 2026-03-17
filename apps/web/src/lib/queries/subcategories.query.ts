import { useQuery } from '@tanstack/react-query'
import { Subcategory } from '@/types'
import { api } from '../api'

export const subcategoryKeys = {
  all: ['subcategories'] as const,
  lists: () => [...subcategoryKeys.all, 'list'] as const,
  list: (
    params?:
      | string
      | { filters?: string; search?: string; categoryId?: string },
  ) => [...subcategoryKeys.lists(), { params }] as const,
  details: () => [...subcategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...subcategoryKeys.details(), id] as const,
}

export function useSubcategoriesQuery() {
  return useQuery<Subcategory[]>({
    queryKey: subcategoryKeys.list(),
    queryFn: async () => {
      const res = await api.subcategories.findAll()
      return res.data
    },
  })
}

export function useSubcategoryQuery(id: string) {
  return useQuery<Subcategory | null>({
    queryKey: subcategoryKeys.detail(id),
    queryFn: async () => {
      const res = await api.subcategories.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useSearchSubcategoriesQuery(
  params?:
    | string
    | {
        filters?: string
        search?: string
        limit?: string
        categoryId?: string
      },
  options?: any,
) {
  return useQuery<Subcategory[]>({
    queryKey: subcategoryKeys.list(params),
    queryFn: async () => {
      const res = await api.subcategories.search(params)
      return res.data
    },
    ...options,
  })
}
