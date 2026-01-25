import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { userKeys } from '../queries/users.query'
import { BulkUpdateUserDto, CreateUserDto, UpdateUserDto } from '@/types'
import { createUserFn } from '@/server/users.server'

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: userKeys.detail('create'),
    mutationFn: async (data: CreateUserDto) => {
      console.log('🚀 ~ useCreateUserMutation ~ data:', data)
      // Send all data including roles and permissions in a single create call
      const response = await createUserFn({ data })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success('User created successfully')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create user')
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: userKeys.detail('update'),
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateUserDto & { roles?: string[]; permissions?: string[] }
    }) => {
      // Send all data including roles and permissions in a single update call
      const response = await api.users.update(id, data)
      return response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.data.id) })
      toast.success('User updated successfully')
    },
    onError: () => {
      toast.error('Failed to update user')
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.users.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success('User deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
  })
}

export function useUpdateBulkUsersMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BulkUpdateUserDto) => api.users.updateBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success('Users updated successfully')
    },
    onError: () => {
      toast.error('Failed to update users')
    },
  })
}

export function useDeleteBulkUsersMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => api.users.deleteBulk(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success('Users deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete users')
    },
  })
}
