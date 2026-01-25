/**
 * API Module (Legacy)
 * This file maintains backward compatibility by re-exporting from the new modular structure
 *
 * New structure:
 * - api-config.ts: API configuration and endpoints
 * - api-client.ts: Core HTTP client with auth
 * - api/auth.api.ts: Auth endpoints
 * - api/session.api.ts: Session endpoints
 * - api/users.api.ts: User endpoints
 * - api/index.ts: Main API export
 */

export { api } from './api/index'
export { apiFetch } from './api-client'
export { API_URL, API_PATH, API_ENDPOINTS } from './api-config'
