import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import { toast } from 'sonner'
import { businessLineKeys } from '../queries/business-lines.query'
import {
  CreateBusinessLineDto,
  UpdateBusinessLineDto,
} from '@/types/business-lines'

export function useCreateBusinessLineMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBusinessLineDto) => api.businessLines.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessLineKeys.all })
      toast.success('Business line created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create business line')
    },
  })
}

export function useUpdateBusinessLineMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBusinessLineDto }) =>
      api.businessLines.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: businessLineKeys.all })
      queryClient.invalidateQueries({
        queryKey: businessLineKeys.detail(variables.id),
      })
      toast.success('Business line updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update business line')
    },
  })
}

export function useDeleteBusinessLineMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.businessLines.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessLineKeys.all })
      toast.success('Business line deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete business line')
    },
  })
}
