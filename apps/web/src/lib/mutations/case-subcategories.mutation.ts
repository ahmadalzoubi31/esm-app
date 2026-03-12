import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { caseSubcategoryKeys } from '../queries/case-subcategories.query'
import { BulkUpdateCaseSubcategoryDto, CreateCaseSubcategoryDto, UpdateCaseSubcategoryDto } from '@/types'
import { queryClient } from '../query-client'

export function useCreateCaseSubcategoryMutation() {
  return useMutation({
    mutationKey: caseSubcategoryKeys.detail('create'),
    mutationFn: async (data: CreateCaseSubcategoryDto) => {
      const response = await api.caseSubcategories.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseSubcategoryKeys.lists() })
      toast.success('Case Subcategory created successfully')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create case subcategory')
    },
  })
}

export function useUpdateCaseSubcategoryMutation() {
  return useMutation({
    mutationKey: caseSubcategoryKeys.detail('update'),
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateCaseSubcategoryDto
    }) => {
      const response = await api.caseSubcategories.update(id, data)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: caseSubcategoryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: caseSubcategoryKeys.detail(data.data.id) })
      toast.success('Case Subcategory updated successfully')
    },
    onError: () => {
      toast.error('Failed to update case subcategory')
    },
  })
}

export function useDeleteCaseSubcategoryMutation() {
  return useMutation({
    mutationFn: (id: string) => api.caseSubcategories.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseSubcategoryKeys.lists() })
      toast.success('Case Subcategory deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete case subcategory')
    },
  })
}

export function useDeleteBulkCaseSubcategoriesMutation() {
  return useMutation({
    mutationFn: (ids: string[]) => api.caseSubcategories.deleteBulk(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseSubcategoryKeys.lists() })
      toast.success('Case Subcategories deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete case subcategories')
    },
  })
}
