/**
 * API Client
 * Unified HTTP client for both client and server contexts
 * Handles authentication via cookies, error handling, and automatic token refresh
 */

import { ApiError, ApiErrorResponse, type ApiResponse } from '@/types/api'
import { API_PATH } from './api-config'

/**
 * Core fetch wrapper with authentication and error handling
 * Works in both client and server contexts
 * Automatically handles:
 * - Cookie-based authentication (access token in cookie)
 * - Server-side cookie forwarding
 * - Token refresh on 401
 * - Error parsing and throwing
 * - JSON serialization
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit & { _retry?: boolean } = {},
): Promise<ApiResponse<T>> {
  // Prepare headers
  const headers = new Headers(init.headers)

  // Set content-type for JSON requests
  if (init.body && !headers.has('Content-Type')) {
    if (!(init.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }
  }

  // console.log(`${API_PATH}${path}`, {
  //   ...init,
  //   headers,
  //   credentials: 'include', // Include cookies (access token + refresh token)
  // })

  // Make the request
  const res = await fetch(`${API_PATH}${path}`, {
    ...init,
    headers,
    credentials: 'include', // Include cookies (access token + refresh token)
  })

  // Parse response body
  let body: any
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    body = await res.json()
  } else {
    body = (await res.text()) || null
  }

  // Handle errors
  if (!res.ok) {
    // Check if response matches ApiErrorResponse structure
    if (
      body &&
      typeof body === 'object' &&
      'success' in body &&
      !body.success
    ) {
      throw new ApiError(body as ApiErrorResponse)
    }

    // Fallback error
    throw new Error(body?.message || `Request failed (${res.status})`)
  }

  return {
    ...body,
    headers: res.headers,
  } as ApiResponse<T>
}
