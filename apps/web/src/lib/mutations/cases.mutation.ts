import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { caseKeys } from '../queries/cases.query'
import { caseCommentKeys } from '../queries/case-comments.query'
import { BulkUpdateCaseDto, CreateCaseCommentDto, CreateCaseDto, UpdateCaseDto } from '@/types'
import { queryClient } from '../query-client'

export function useCreateCaseMutation() {
  return useMutation({
    mutationKey: caseKeys.detail('create'),
    mutationFn: async (data: CreateCaseDto) => {
      const response = await api.cases.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() })
      toast.success('Case created successfully')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create case')
    },
  })
}

export function useUpdateCaseMutation() {
  return useMutation({
    mutationKey: caseKeys.detail('update'),
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateCaseDto
    }) => {
      const response = await api.cases.update(id, data)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() })
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(data.data.id) })
      toast.success('Case updated successfully')
    },
    onError: () => {
      toast.error('Failed to update case')
    },
  })
}

export function useDeleteCaseMutation() {
  return useMutation({
    mutationFn: (id: string) => api.cases.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() })
      toast.success('Case deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete case')
    },
  })
}

export function useDeleteBulkCasesMutation() {
  return useMutation({
    mutationFn: (ids: string[]) => api.cases.deleteBulk(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() })
      toast.success('Cases deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete cases')
    },
  })
}

export function useCreateCaseCommentMutation(caseId: string) {
  return useMutation({
    mutationFn: (data: CreateCaseCommentDto) =>
      api.caseComments.create(caseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseCommentKeys.list(caseId) })
    },
    onError: () => {
      toast.error('Failed to send comment')
    },
  })
}

export function useDeleteCaseCommentMutation(caseId: string) {
  return useMutation({
    mutationFn: (commentId: string) => api.caseComments.remove(caseId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseCommentKeys.list(caseId) })
      toast.success('Comment deleted')
    },
    onError: () => {
      toast.error('Failed to delete comment')
    },
  })
}
