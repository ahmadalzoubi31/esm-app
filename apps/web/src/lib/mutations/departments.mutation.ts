import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import { toast } from 'sonner'
import { departmentKeys } from '../queries/departments.query'

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => api.departments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      toast.success('Department created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create department')
    },
  })
}

export function useUpdateDepartmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.departments.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail(variables.id),
      })
      toast.success('Department updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update department')
    },
  })
}

export function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.departments.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      toast.success('Department deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete department')
    },
  })
}

export function useDeleteBulkDepartmentsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => api.departments.deleteBulk(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all })
      toast.success('Departments deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete departments')
    },
  })
}
