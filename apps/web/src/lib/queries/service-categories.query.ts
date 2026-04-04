import { useQuery } from '@tanstack/react-query'
import type { ServiceCategorySchema } from '@repo/shared'
import { api } from '../api'

export const serviceCategoryKeys = {
  all: ['service-categories'] as const,
  lists: () => [...serviceCategoryKeys.all, 'list'] as const,
  list: () => [...serviceCategoryKeys.lists()] as const,
  details: () => [...serviceCategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceCategoryKeys.details(), id] as const,
}

export function useServiceCategoriesQuery() {
  return useQuery<ServiceCategorySchema[]>({
    queryKey: serviceCategoryKeys.list(),
    queryFn: async () => {
      const res = await api.serviceCategories.findAll()
      return res.data
    },
  })
}

export function useServiceCategoryQuery(id: string) {
  return useQuery<ServiceCategorySchema | null>({
    queryKey: serviceCategoryKeys.detail(id),
    queryFn: async () => {
      const res = await api.serviceCategories.findOne(id)
      return res.data
    },
    enabled: !!id,
  })
}
