import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { groupKeys } from '../queries/groups.query'
import { BulkUpdateGroupDto, CreateGroupDto, UpdateGroupDto } from '@/types'
import { queryClient } from '../query-client'

export function useCreateGroupMutation() {
  return useMutation({
    mutationKey: groupKeys.detail('create'),
    mutationFn: async (data: CreateGroupDto) => {
      const response = await api.groups.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
      toast.success('Group created successfully')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create group')
    },
  })
}

export function useUpdateGroupMutation() {
  return useMutation({
    mutationKey: groupKeys.detail('update'),
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateGroupDto
    }) => {
      const response = await api.groups.update(id, data)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(data.data.id) })
      toast.success('Group updated successfully')
    },
    onError: () => {
      toast.error('Failed to update group')
    },
  })
}

export function useDeleteGroupMutation() {
  return useMutation({
    mutationFn: (id: string) => api.groups.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
      toast.success('Group deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete group')
    },
  })
}

export function useUpdateBulkGroupsMutation() {
  return useMutation({
    mutationFn: (data: BulkUpdateGroupDto) => api.groups.updateBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
      toast.success('Groups updated successfully')
    },
    onError: () => {
      toast.error('Failed to update groups')
    },
  })
}

export function useDeleteBulkGroupsMutation() {
  return useMutation({
    mutationFn: (ids: string[]) => api.groups.deleteBulk(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() })
      toast.success('Groups deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete groups')
    },
  })
}
