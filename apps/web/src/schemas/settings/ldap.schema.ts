import { z } from 'zod'

export const LdapConfigSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.number().min(1, 'Port is required'),
  bindDn: z.string().min(1, 'Bind DN is required'),
  bindPassword: z.string(),
  baseDn: z.string().min(1, 'Base DN is required'),
  userFilter: z.string(),
  scopeFilter: z.string(),
  useSsl: z.boolean(),
  enabled: z.boolean(),
  attributeMapping: z.object({
    // Required fields
    firstName: z.string().min(1, 'First Name mapping is required'),
    lastName: z.string().min(1, 'Last Name mapping is required'),
    username: z.string().min(1, 'Username mapping is required'),
    // Optional standard fields
    email: z.string().optional(),
    phone: z.string().optional(),
    department: z.string().optional(),
    manager: z.string().optional(),
    // Metadata fields
    mobilePhone: z.string().optional(),
    title: z.string().optional(),
    company: z.string().optional(),
    employeeId: z.string().optional(),
    employeeType: z.string().optional(),
    location: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    userPrincipalName: z.string().optional(),
    // Custom attributes (dynamic key-value pairs)
    customAttributes: z.record(z.string(), z.string()).optional(),
  }),
})

export const LdapConfigCreateSchema = LdapConfigSchema.omit({
  host: true,
  port: true,
  bindDn: true,
  bindPassword: true,
  baseDn: true,
  userFilter: true,
  scopeFilter: true,
  useSsl: true,
  enabled: true,
  attributeMapping: true,
})

export const LdapConfigUpdateSchema = LdapConfigSchema.omit({
  host: true,
  port: true,
  bindDn: true,
  bindPassword: true,
  baseDn: true,
  userFilter: true,
  scopeFilter: true,
  useSsl: true,
  enabled: true,
  attributeMapping: true,
})

export const LdapUserPreviewSchema = z.object({
  dn: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  exists: z.boolean(),
  // Attributes from mapping
  phone: z.string().optional(),
  department: z.string().optional(),
  manager: z.string().optional(),
  mobilePhone: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  employeeId: z.string().optional(),
  employeeType: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  userPrincipalName: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
})

export type LdapUserPreview = z.infer<typeof LdapUserPreviewSchema>

export const StagingModeEnum = z.enum([
  'FULL_STAGING',
  'NEW_USERS_ONLY',
  'DISABLED',
])

export type StagingMode = z.infer<typeof StagingModeEnum>

export const LdapSyncScheduleSchema = z.object({
  syncEnabled: z.boolean(),
  syncSchedule: z.string().min(1, 'Sync schedule is required'),
  stagingMode: StagingModeEnum.default('FULL_STAGING'),
})

export type LdapConfigCreateDto = z.infer<typeof LdapConfigCreateSchema>
export type LdapConfigUpdateDto = z.infer<typeof LdapConfigUpdateSchema>
export type LdapConfig = z.infer<typeof LdapConfigSchema>
export type LdapSyncSchedule = z.infer<typeof LdapSyncScheduleSchema>
