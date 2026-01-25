/**
 * API Client
 * Unified HTTP client for both client and server contexts
 * Handles authentication via cookies, error handling, and automatic token refresh
 */

import { ApiError, type ApiErrorResponse, type ApiResponse } from '@/types/api'
import { API_ENDPOINTS, API_PATH } from './api-config'
// import { getRequestHeaders } from '@tanstack/react-start/server'

/**
 * Check if we're running on the server
 */
function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * Get server-side request headers (cookies)
 * Only works when called within a server function context
 */
// async function getServerHeaders(): Promise<Record<string, string>> {
//   if (!isServer()) return {}

//   try {
//     // Dynamic import to avoid bundling server-only code in client
//     const headers = getRequestHeaders()
//     const serverHeaders: Record<string, string> = {}

//     if (headers instanceof Headers) {
//       const cookie = headers.get('cookie')
//       if (cookie) serverHeaders['Cookie'] = cookie
//     } else {
//       // Handle plain object case
//       const h = headers as Record<string, string>
//       const cookie = h['cookie'] || h['Cookie']
//       if (cookie) serverHeaders['Cookie'] = cookie
//     }

//     return serverHeaders
//   } catch (error) {
//     // Not in a request context or import failed
//     return {}
//   }
// }

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
    headers.set('Content-Type', 'application/json')
  }

  // On server: forward cookies from incoming request
  // if (isServer()) {
  //   const serverHeaders = await getServerHeaders()
  //   for (const [key, value] of Object.entries(serverHeaders)) {
  //     // Prioritize headers passed in init (e.g. during retry with new cookies)
  //     if (!headers.has(key)) {
  //       headers.set(key, value)
  //     }
  //   }
  // }

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
    // Handle 401 Unauthorized - Try to refresh token
    if (res.status === 401 && !init._retry && !path.includes('logout')) {
      if (!path.includes('refresh')) {
        try {
          // Attempt token refresh
          // Use raw fetch to access response headers (Set-Cookie)
          const refreshRes = await fetch(
            `${API_PATH}${API_ENDPOINTS.AUTH.REFRESH}`,
            {
              method: 'POST',
              headers,
              credentials: 'include',
            },
          )

          if (!refreshRes.ok) {
            throw new Error('Refresh failed')
          }

          // Handle Server-Side Cookie Propagation
          // if (isServer()) {
          //   // Extract Set-Cookie header(s)
          //   const setCookie =
          //     (refreshRes.headers as any).getSetCookie?.() ||
          //     refreshRes.headers.get('set-cookie')

          //   if (setCookie) {
          //     const cookies = Array.isArray(setCookie)
          //       ? setCookie
          //       : [setCookie as string]

          //     // Format cookie string for the retry request
          //     const cookieHeader = cookies
          //       .map((c: string) => c.split(';')[0])
          //       .join('; ')

          //     if (cookieHeader) {
          //       // Retry with new cookies
          //       const retryHeaders = new Headers(init.headers)
          //       retryHeaders.set('Cookie', cookieHeader)

          //       return apiFetch<T>(path, {
          //         ...init,
          //         headers: retryHeaders,
          //         _retry: true,
          //       })
          //     }
          //   }
          // }

          // Client-side: Browser updates cookie jar automatically
          return apiFetch<T>(path, { ...init, _retry: true })
        } catch (refreshError) {
          // Refresh failed - throw session expired error
          throw new ApiError({
            success: false,
            message: 'Session expired',
            code: 'UNAUTHORIZED',
            statusCode: 401,
          })
        }
      }
    }

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

  return body as ApiResponse<T>
}
