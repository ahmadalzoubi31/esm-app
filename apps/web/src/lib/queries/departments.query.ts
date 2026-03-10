import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: string) => [...departmentKeys.lists(), { filters }] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
}

export function useDepartmentsQuery(filters?: string) {
  return useQuery({
    queryKey: filters ? departmentKeys.list(filters) : departmentKeys.lists(),
    queryFn: async () => await api.departments.findAll(filters),
  })
}

export function useDepartmentQuery(id: string) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => await api.departments.findOne(id),
    enabled: !!id,
  })
}
