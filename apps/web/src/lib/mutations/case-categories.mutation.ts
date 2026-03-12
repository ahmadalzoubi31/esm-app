import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { caseCategoryKeys } from '../queries/case-categories.query'
import { BulkUpdateCaseCategoryDto, CreateCaseCategoryDto, UpdateCaseCategoryDto } from '@/types'
import { queryClient } from '../query-client'

export function useCreateCaseCategoryMutation() {
  return useMutation({
    mutationKey: caseCategoryKeys.detail('create'),
    mutationFn: async (data: CreateCaseCategoryDto) => {
      const response = await api.caseCategories.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseCategoryKeys.lists() })
      toast.success('Case Category created successfully')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create case category')
    },
  })
}

export function useUpdateCaseCategoryMutation() {
  return useMutation({
    mutationKey: caseCategoryKeys.detail('update'),
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateCaseCategoryDto
    }) => {
      const response = await api.caseCategories.update(id, data)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: caseCategoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: caseCategoryKeys.detail(data.data.id) })
      toast.success('Case Category updated successfully')
    },
    onError: () => {
      toast.error('Failed to update case category')
    },
  })
}

export function useDeleteCaseCategoryMutation() {
  return useMutation({
    mutationFn: (id: string) => api.caseCategories.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseCategoryKeys.lists() })
      toast.success('Case Category deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete case category')
    },
  })
}

export function useDeleteBulkCaseCategoriesMutation() {
  return useMutation({
    mutationFn: (ids: string[]) => api.caseCategories.deleteBulk(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseCategoryKeys.lists() })
      toast.success('Case Categories deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete case categories')
    },
  })
}
