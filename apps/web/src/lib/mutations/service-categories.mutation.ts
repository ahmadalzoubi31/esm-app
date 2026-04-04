import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { serviceCategoryKeys } from '../queries/service-categories.query'
import type { ServiceCategoryDto } from '@repo/shared'
import { queryClient } from '../query-client'

export function useCreateServiceCategoryMutation() {
  return useMutation({
    mutationFn: (data: ServiceCategoryDto) =>
      api.serviceCategories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.lists() })
      toast.success('Service category created successfully')
    },
    onError: () => {
      toast.error('Failed to create service category')
    },
  })
}

export function useUpdateServiceCategoryMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceCategoryDto }) =>
      api.serviceCategories.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: serviceCategoryKeys.detail(data.data.id),
      })
      toast.success('Service category updated successfully')
    },
    onError: () => {
      toast.error('Failed to update service category')
    },
  })
}

export function useDeleteServiceCategoryMutation() {
  return useMutation({
    mutationFn: (id: string) => api.serviceCategories.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.lists() })
      toast.success('Service category deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete service category')
    },
  })
}
