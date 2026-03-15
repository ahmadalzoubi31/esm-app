/**
 * Case Comments API
 */

import type { ApiResponse } from '@/types/api'
import type { CaseComment, CreateCaseCommentDto } from '@/types/cases'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const caseCommentsApi = {
  findAll: async (caseId: string): Promise<ApiResponse<CaseComment[]>> => {
    return await apiFetch<CaseComment[]>(API_ENDPOINTS.CASE_COMMENTS.LIST(caseId), {
      method: 'GET',
    })
  },

  create: async (
    caseId: string,
    data: CreateCaseCommentDto,
  ): Promise<ApiResponse<CaseComment>> => {
    return await apiFetch<CaseComment>(API_ENDPOINTS.CASE_COMMENTS.CREATE(caseId), {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (
    caseId: string,
    id: string,
    data: Partial<CreateCaseCommentDto>,
  ): Promise<ApiResponse<CaseComment>> => {
    return await apiFetch<CaseComment>(API_ENDPOINTS.CASE_COMMENTS.UPDATE(caseId, id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  remove: async (caseId: string, id: string): Promise<ApiResponse<void>> => {
    return await apiFetch<void>(API_ENDPOINTS.CASE_COMMENTS.DELETE(caseId, id), {
      method: 'DELETE',
    })
  },
}
