/**
 * Case Attachments API
 */

import type { ApiResponse } from '@/types/api'
import type { CaseAttachment } from '@/types/cases'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const caseAttachmentsApi = {
  findAll: async (caseId: string): Promise<ApiResponse<CaseAttachment[]>> => {
    return await apiFetch<CaseAttachment[]>(API_ENDPOINTS.CASE_ATTACHMENTS.LIST(caseId), {
      method: 'GET',
    })
  },

  upload: async (
    caseId: string,
    file: File,
  ): Promise<ApiResponse<CaseAttachment>> => {
    const formData = new FormData()
    formData.append('file', file)

    return await apiFetch<CaseAttachment>(API_ENDPOINTS.CASE_ATTACHMENTS.UPLOAD(caseId), {
      method: 'POST',
      body: formData,
      // Note: apiFetch should handle headers automatically for FormData, 
      // but we might need to ensure Content-Type is NOT set to application/json
    })
  },

  remove: async (caseId: string, id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.CASE_ATTACHMENTS.DELETE(caseId, id), {
      method: 'DELETE',
    })
  },
}
