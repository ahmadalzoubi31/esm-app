import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { subcategoryKeys } from '../queries/subcategories.query'
import {
  BulkUpdateSubcategoryDto,
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
} from '@/types'
import { queryClient } from '../query-client'

export function useCreateSubcategoryMutation() {
  return useMutation({
    mutationKey: subcategoryKeys.detail('create'),
    mutationFn: async (data: CreateSubcategoryDto) => {
      const response = await api.subcategories.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subcategoryKeys.lists() })
      toast.success('Subcategory created successfully')
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create subcategory',
      )
    },
  })
}

export function useUpdateSubcategoryMutation() {
  return useMutation({
    mutationKey: subcategoryKeys.detail('update'),
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateSubcategoryDto
    }) => {
      const response = await api.subcategories.update(id, data)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subcategoryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: subcategoryKeys.detail(data.data.id),
      })
      toast.success('Subcategory updated successfully')
    },
    onError: () => {
      toast.error('Failed to update subcategory')
    },
  })
}

export function useDeleteSubcategoryMutation() {
  return useMutation({
    mutationFn: (id: string) => api.subcategories.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subcategoryKeys.lists() })
      toast.success('Subcategory deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete subcategory')
    },
  })
}

export function useDeleteBulkSubcategoriesMutation() {
  return useMutation({
    mutationFn: (ids: string[]) => api.subcategories.deleteBulk(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subcategoryKeys.lists() })
      toast.success('Subcategories deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete subcategories')
    },
  })
}
