import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { serviceKeys } from '../queries/services.query'
import type { ServiceDto } from '@repo/shared'
import { queryClient } from '../query-client'

export function useCreateServiceMutation() {
  return useMutation({
    mutationFn: (data: ServiceDto) => api.services.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      toast.success('Service created successfully')
    },
    onError: () => {
      toast.error('Failed to create service')
    },
  })
}

export function useUpdateServiceMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceDto> }) =>
      api.services.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: serviceKeys.detail(data.data.id),
      })
      toast.success('Service updated successfully')
    },
    onError: () => {
      toast.error('Failed to update service')
    },
  })
}

export function useDeleteServiceMutation() {
  return useMutation({
    mutationFn: (id: string) => api.services.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() })
      toast.success('Service deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete service')
    },
  })
}
