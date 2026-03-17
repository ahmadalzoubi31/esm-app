import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { CategoryKeys } from '../queries/categories.query'
import {
  BulkUpdateCategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types'
import { queryClient } from '../query-client'

export function useCreateCategoryMutation() {
  return useMutation({
    mutationKey: CategoryKeys.detail('create'),
    mutationFn: async (data: CreateCategoryDto) => {
      const response = await api.categories.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CategoryKeys.lists() })
      toast.success('category created successfully')
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create case category',
      )
    },
  })
}

export function useUpdateCategoryMutation() {
  return useMutation({
    mutationKey: CategoryKeys.detail('update'),
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateCategoryDto
    }) => {
      const response = await api.categories.update(id, data)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CategoryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: CategoryKeys.detail(data.data.id),
      })
      toast.success('category updated successfully')
    },
    onError: () => {
      toast.error('Failed to update case category')
    },
  })
}

export function useDeleteCategoryMutation() {
  return useMutation({
    mutationFn: (id: string) => api.categories.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CategoryKeys.lists() })
      toast.success('category deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete case category')
    },
  })
}

export function useDeleteBulkCategoriesMutation() {
  return useMutation({
    mutationFn: (ids: string[]) => api.categories.deleteBulk(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CategoryKeys.lists() })
      toast.success('Case Categories deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete case categories')
    },
  })
}
