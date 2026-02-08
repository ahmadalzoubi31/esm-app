/**
 * Auth API
 * Authentication-related API endpoints
 */

import type { ApiResponse } from '@/types/api'
import type {
  AuthUser,
  AuthResponse,
  ResetPasswordDto,
  SignInDto,
} from '@/types/auth'
import { apiFetch } from '../api-client'
import { API_ENDPOINTS } from '../api-config'

export const authApi = {
  /**
   * Sign in with credentials
   */
  signIn: async (data: SignInDto): Promise<ApiResponse<AuthResponse>> => {
    return await apiFetch<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Logout current session
   */
  logout: async (): Promise<ApiResponse<boolean>> => {
    return await apiFetch<boolean>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    })
  },

  /**
   * Logout all sessions
   */
  logoutAll: async (): Promise<ApiResponse<boolean>> => {
    return await apiFetch<boolean>(API_ENDPOINTS.AUTH.LOGOUT_ALL, {
      method: 'POST',
    })
  },

  /**
   * Get current user profile
   */
  getProfile: async (
    init: RequestInit = {},
  ): Promise<ApiResponse<AuthUser>> => {
    return await apiFetch<AuthUser>(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'GET',
      ...init,
    })
  },

  /**
   * Refresh access token using refresh token cookie
   */
  refreshTokens: async (
    init: RequestInit = {},
  ): Promise<ApiResponse<AuthResponse>> => {
    return await apiFetch<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      ...init,
    })
  },

  /**
   * Reset password
   */
  resetPassword: async (
    data: ResetPasswordDto,
  ): Promise<ApiResponse<boolean>> => {
    return await apiFetch<boolean>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Cleanup old/expired tokens
   */
  cleanupOldTokens: async (): Promise<
    ApiResponse<{
      message: string
      deletedCount: number
    }>
  > => {
    return await apiFetch<{ message: string; deletedCount: number }>(
      API_ENDPOINTS.AUTH.CLEANUP_TOKENS,
      {
        method: 'POST',
      },
    )
  },
}
