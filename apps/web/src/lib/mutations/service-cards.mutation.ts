import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { serviceCardKeys } from '../queries/service-cards.query'
import type { ServiceCardDto } from '@repo/shared'
import { queryClient } from '../query-client'

export function useCreateServiceCardMutation() {
  return useMutation({
    mutationFn: (data: ServiceCardDto) => api.serviceCards.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceCardKeys.lists() })
      toast.success('Service card created successfully')
    },
    onError: () => {
      toast.error('Failed to create service card')
    },
  })
}

export function useUpdateServiceCardMutation() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<ServiceCardDto>
    }) => api.serviceCards.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceCardKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: serviceCardKeys.detail(data.data.id),
      })
      toast.success('Service card updated successfully')
    },
    onError: () => {
      toast.error('Failed to update service card')
    },
  })
}

export function useDeleteServiceCardMutation() {
  return useMutation({
    mutationFn: (id: string) => api.serviceCards.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceCardKeys.lists() })
      toast.success('Service card deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete service card')
    },
  })
}
