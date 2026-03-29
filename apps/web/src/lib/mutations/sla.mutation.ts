import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { CreateSlaTarget, UpdateSlaTarget } from '@/types'
import { toast } from 'sonner'

export const useCreateSlaTargetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateSlaTarget) => {
      const response = await api.sla.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sla', 'targets'] })
      toast.success('SLA target created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create SLA target')
    },
  })
}

export const useUpdateSlaTargetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSlaTarget }) => {
      const response = await api.sla.update(id, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sla', 'targets'] })
      queryClient.invalidateQueries({ queryKey: ['sla', 'targets', data.id] })
      toast.success('SLA target updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update SLA target')
    },
  })
}

export const useDeleteSlaTargetMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.sla.remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sla', 'targets'] })
      toast.success('SLA target deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete SLA target')
    },
  })
}
