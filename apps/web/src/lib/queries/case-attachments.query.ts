import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CaseAttachment } from '@/types/cases'
import { api } from '../api'
import { toast } from 'sonner'

export const caseAttachmentKeys = {
  all: ['case-attachments'] as const,
  lists: () => [...caseAttachmentKeys.all, 'list'] as const,
  list: (caseId: string) => [...caseAttachmentKeys.lists(), caseId] as const,
}

export function useCaseAttachmentsQuery(caseId: string) {
  return useQuery<CaseAttachment[]>({
    queryKey: caseAttachmentKeys.list(caseId),
    queryFn: async () => {
      const res = await api.caseAttachments.findAll(caseId)
      return res.data
    },
    enabled: !!caseId,
  })
}

export function useUploadAttachmentMutation(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const res = await api.caseAttachments.upload(caseId, file)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseAttachmentKeys.list(caseId) })
      toast.success('File uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`)
    },
  })
}

export function useDeleteAttachmentMutation(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (attachmentId: string) => {
      const res = await api.caseAttachments.remove(caseId, attachmentId)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseAttachmentKeys.list(caseId) })
      toast.success('Attachment deleted successfully')
    },
    onError: (error: any) => {
      toast.error(`Deletion failed: ${error.message || 'Unknown error'}`)
    },
  })
}
