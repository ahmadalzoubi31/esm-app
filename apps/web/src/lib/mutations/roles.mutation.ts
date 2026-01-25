import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  AssignRolesDto,
} from '@/types'
import { toast } from 'sonner'
import { roleKeys } from '../queries/roles.query'

export function useCreateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRoleDto) => api.roles.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
      toast.success('Role created successfully')
    },
    onError: () => {
      toast.error('Failed to create role')
    },
  })
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDto }) =>
      api.roles.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(data.data.id) })
      toast.success('Role updated successfully')
    },
    onError: () => {
      toast.error('Failed to update role')
    },
  })
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.roles.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
      toast.success('Role deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete role')
    },
  })
}

export function useAssignPermissionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignPermissionsDto }) =>
      api.roles.assignPermissions(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.permissions(variables.id),
      })
      // Maybe invalidate role detail if it contains permission count
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) })
      toast.success('Permissions assigned successfully')
    },
    onError: () => {
      toast.error('Failed to assign permissions')
    },
  })
}

export function useRemovePermissionsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignPermissionsDto }) =>
      api.roles.removePermissions(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.permissions(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) })
      toast.success('Permissions removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove permissions')
    },
  })
}

export function useAssignRolesToUserMutation() {
  // Logic could trigger user list invalidation if needed
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AssignRolesDto }) =>
      api.roles.assignRolesToUser(userId, data),
    onSuccess: () => {
      toast.success('Roles assigned to user successfully')
      // Assuming user keys are imported or we use sting matching if they are in another file
      // queryClient.invalidateQueries({ queryKey: ['users', 'detail', userId] })
    },
    onError: () => {
      toast.error('Failed to assign roles to user')
    },
  })
}

export function useRemoveRolesFromUserMutation() {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AssignRolesDto }) =>
      api.roles.removeRolesFromUser(userId, data),
    onSuccess: () => {
      toast.success('Roles removed from user successfully')
    },
    onError: () => {
      toast.error('Failed to remove roles from user')
    },
  })
}
