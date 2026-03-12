/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

export const API_URL = import.meta.env.VITE_API_URL as string
export const API_PATH = `${API_URL}/v1`

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
    CLEANUP_TOKENS: '/auth/cleanup-tokens',
  },
  // Session endpoints
  SESSION: {
    LIST: '/auth/sessions',
    REVOKE: (sessionId: number) => `/auth/sessions/${sessionId}/revoke`,
  },
  // User endpoints
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    BULK_UPDATE: '/users',
    BULK_DELETE: '/users',
    UPLOAD_AVATAR: '/users/avatar/upload',
  },
  // Group endpoints
  GROUPS: {
    LIST: '/groups',
    DETAIL: (id: string) => `/groups/${id}`,
    CREATE: '/groups',
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
    BULK_UPDATE: '/groups',
    BULK_DELETE: '/groups',
  },
  // Business Line endpoints
  BUSINESS_LINES: {
    LIST: '/business-line',
    DETAIL: (id: string) => `/business-line/${id}`,
    CREATE: '/business-line',
    UPDATE: (id: string) => `/business-line/${id}`,
    DELETE: (id: string) => `/business-line/${id}`,
  },
  // Department endpoints
  DEPARTMENTS: {
    LIST: '/departments',
    DETAIL: (id: string) => `/departments/${id}`,
    CREATE: '/departments',
    UPDATE: (id: string) => `/departments/${id}`,
    DELETE: (id: string) => `/departments/${id}`,
    BULK_DELETE: '/departments',
  },
  // Case Categories endpoints
  CASE_CATEGORIES: {
    LIST: '/case-categories',
    DETAIL: (id: string) => `/case-categories/${id}`,
    CREATE: '/case-categories',
    UPDATE: (id: string) => `/case-categories/${id}`,
    DELETE: (id: string) => `/case-categories/${id}`,
    BULK_DELETE: '/case-categories',
  },
  // Case Subcategories endpoints
  CASE_SUBCATEGORIES: {
    LIST: '/case-subcategories',
    DETAIL: (id: string) => `/case-subcategories/${id}`,
    CREATE: '/case-subcategories',
    UPDATE: (id: string) => `/case-subcategories/${id}`,
    DELETE: (id: string) => `/case-subcategories/${id}`,
    BULK_DELETE: '/case-subcategories',
  },
  // Cases endpoints
  CASES: {
    LIST: '/cases',
    DETAIL: (id: string) => `/cases/${id}`,
    CREATE: '/cases',
    UPDATE: (id: string) => `/cases/${id}`,
    DELETE: (id: string) => `/cases/${id}`,
    BULK_DELETE: '/cases',
  },
  // Role endpoints
  ROLES: {
    LIST: '/roles',
    DETAIL: (id: string) => `/roles/${id}`,
    CREATE: '/roles',
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
    BULK_DELETE: '/roles',
    // Permissions
    PERMISSIONS: (id: string) => `/roles/${id}/permissions`,
    // User assignment
    ASSIGN_TO_USER: (userId: string) => `/roles/user/${userId}`,
  },
  // Permission endpoints
  PERMISSIONS: {
    LIST: '/permissions',
    DETAIL: (id: string) => `/permissions/${id}`,
    CREATE: '/permissions',
    UPDATE: (id: string) => `/permissions/${id}`,
    DELETE: (id: string) => `/permissions/${id}`,
    // User assignment
    ASSIGN_TO_USER: (userId: string) => `/permissions/user/${userId}`,
  },
  // LDAP endpoints
  LDAP: {
    CONFIG: '/ldap/config',
    TEST: '/ldap/test',
    SYNC: '/ldap/sync',
    SYNC_STATUS: (jobId: string) => `/ldap/sync/${jobId}`,
    HISTORY: '/ldap/history',
    PREVIEW: '/ldap/preview',
    SCHEDULE: '/ldap/schedule',
  },
} as const
