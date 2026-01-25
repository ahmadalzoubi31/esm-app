/**
 * Session API
 * Session management endpoints
 */

import type { ApiResponse } from '@/types/api'
import type { SessionInfo } from '@/types/session'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const sessionApi = {
  /**
   * Get all active sessions for current user
   */
  getSessions: async (): Promise<ApiResponse<SessionInfo[]>> => {
    return await apiFetch<SessionInfo[]>(API_ENDPOINTS.SESSION.LIST, {
      method: 'GET',
    })
  },

  /**
   * Revoke a specific session
   */
  revokeSession: async (sessionId: number): Promise<ApiResponse<boolean>> => {
    return await apiFetch<boolean>(API_ENDPOINTS.SESSION.REVOKE(sessionId), {
      method: 'POST',
    })
  },
}
