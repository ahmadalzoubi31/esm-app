import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: string) => [...roleKeys.lists(), { filters }] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  permissions: (id: string) => [...roleKeys.detail(id), 'permissions'] as const,
}

export function useRolesQuery(filters?: string) {
  return useQuery({
    queryKey: filters ? roleKeys.list(filters) : roleKeys.lists(),
    queryFn: async () => await api.roles.findAll(filters),
  })
}

export function useRoleQuery(id: string) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: async () => await api.roles.findOne(id),
    enabled: !!id,
  })
}

export function useRolePermissionsQuery(id: string) {
  return useQuery({
    queryKey: roleKeys.permissions(id),
    queryFn: async () => await api.roles.findPermissions(id),
    enabled: !!id,
  })
}
