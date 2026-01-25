import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (filters: string) => [...permissionKeys.lists(), { filters }] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionKeys.details(), id] as const,
}

export function usePermissionsQuery(filters?: string) {
  return useQuery({
    queryKey: filters ? permissionKeys.list(filters) : permissionKeys.lists(),
    queryFn: async () => await api.permissions.findAll(filters),
  })
}

export function usePermissionQuery(id: string) {
  return useQuery({
    queryKey: permissionKeys.detail(id),
    queryFn: async () => await api.permissions.findOne(id),
    enabled: !!id,
  })
}
