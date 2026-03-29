import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useSlaTargetsQuery = () => {
  return useQuery({
    queryKey: ['sla', 'targets'],
    queryFn: async () => {
      const response = await api.sla.findAll()
      return response.data
    },
  })
}

export const useSlaTargetQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: ['sla', 'targets', id],
    queryFn: async () => {
      if (!id) return null
      const response = await api.sla.findOne(id)
      return response.data
    },
    enabled: !!id,
  })
}
