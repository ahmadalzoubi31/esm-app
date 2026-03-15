import { useQuery } from '@tanstack/react-query'
import { CaseComment } from '@/types/cases'
import { api } from '../api'

export const caseCommentKeys = {
  all: ['case-comments'] as const,
  lists: () => [...caseCommentKeys.all, 'list'] as const,
  list: (caseId: string) => [...caseCommentKeys.lists(), caseId] as const,
}

export function useCaseCommentsQuery(caseId: string) {
  return useQuery<CaseComment[]>({
    queryKey: caseCommentKeys.list(caseId),
    queryFn: async () => {
      const res = await api.caseComments.findAll(caseId)
      return res.data
    },
    enabled: !!caseId,
  })
}
