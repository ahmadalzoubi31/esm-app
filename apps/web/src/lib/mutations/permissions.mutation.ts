import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  CreatePermissionDto,
  UpdatePermissionDto,
  AssignUserPermissionsDto,
} from '@/types'
import { toast } from 'sonner'
import { permissionKeys } from '../queries/permissions.query'

export function useCreatePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePermissionDto) => api.permissions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
      toast.success('Permission created successfully')
    },
    onError: () => {
      toast.error('Failed to create permission')
    },
  })
}

export function useUpdatePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionDto }) =>
      api.permissions.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: permissionKeys.detail(data.data.id),
      })
      toast.success('Permission updated successfully')
    },
    onError: () => {
      toast.error('Failed to update permission')
    },
  })
}

export function useDeletePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.permissions.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
      toast.success('Permission deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete permission')
    },
  })
}

export function useAssignPermissionsToUserMutation() {
  // Logic to invalidate user permissions or user details might be needed here
  // const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: AssignUserPermissionsDto
    }) => api.permissions.assignPermissionsToUser(userId, data),
    onSuccess: () => {
      toast.success('Permissions assigned to user successfully')
    },
    onError: () => {
      toast.error('Failed to assign permissions to user')
    },
  })
}

export function useRemovePermissionsFromUserMutation() {
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: AssignUserPermissionsDto
    }) => api.permissions.removePermissionsFromUser(userId, data),
    onSuccess: () => {
      toast.success('Permissions removed from user successfully')
    },
    onError: () => {
      toast.error('Failed to remove permissions from user')
    },
  })
}
