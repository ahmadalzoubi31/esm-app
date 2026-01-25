/**
 * Permission keys as constants for type-safe usage in decorators and guards
 * These should match the keys in permissions.seed.ts
 */
export const PERMISSIONS = {
  // Case Management
  CASE_CREATE: 'case:create',
  CASE_READ_ANY: 'case:read:any',
  CASE_READ_OWN: 'case:read:own',
  CASE_READ_ASSIGNED: 'case:read:assigned',
  CASE_READ_GROUP: 'case:read:group',
  CASE_UPDATE_ASSIGNED: 'case:update:assigned',
  CASE_UPDATE_ANY: 'case:update:any',
  CASE_DELETE: 'case:delete',

  // Request Management
  REQUEST_CREATE: 'request:create',
  REQUEST_READ_ANY: 'request:read:any',
  REQUEST_READ_OWN: 'request:read:own',
  REQUEST_READ_ASSIGNED: 'request:read:assigned',
  REQUEST_READ_GROUP: 'request:read:group',
  REQUEST_UPDATE_ASSIGNED: 'request:update:assigned',
  REQUEST_UPDATE_ANY: 'request:update:any',

  // IAM
  USER_MANAGE: 'user:manage',
  USER_MANAGE_LICENSE: 'user:manage-license',
  GROUP_MANAGE: 'group:manage',
  ROLE_MANAGE: 'role:manage',
  PERMISSION_MANAGE: 'permission:manage',

  // Foundation
  FOUNDATION_MANAGE: 'foundation:manage',
  FOUNDATION_PEOPLE: 'foundation:people',
  FOUNDATION_SUPPORT_GROUPS: 'foundation:support-groups',
  FOUNDATION_CATEGORY: 'foundation:category',
  GROUP_MANAGE_MEMBERS: 'group:manage-members',
  USER_MANAGE_GROUP_MEMBERS: 'user:manage-group-members',

  // Service Catalog
  SERVICE_READ: 'service:read',
  SERVICE_SUBMIT: 'service:submit',
  SERVICE_MANAGE: 'service:manage',

  // Business Line
  BUSINESS_LINE_READ: 'business-line:read',
  BUSINESS_LINE_MANAGE: 'business-line:manage',

  // Workflow
  WORKFLOW_READ: 'workflow:read',
  WORKFLOW_MANAGE: 'workflow:manage',

  // SLA
  SLA_READ: 'sla:read',
  SLA_MANAGE: 'sla:manage',

  // Email
  EMAIL_READ: 'email:read',
  EMAIL_MANAGE: 'email:manage',

  // Audit
  AUDIT_READ: 'audit:read',

  // Notification
  NOTIFY_MANAGE: 'notify:manage',

  // Admin
  ADMIN_MANAGE_ALL: 'admin:manage:all',
} as const;

// Type for permission keys
export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Value
export const PERMISSION_VALUES = Object.values(PERMISSIONS);
