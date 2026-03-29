// *************************
// ** sla **
// *************************
import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Enums — rename a value here and every consumer breaks immediately
// ─────────────────────────────────────────────────────────────────────────────

export const SlaTypeEnumSchema = z.enum(["respond", "resolution"]);
export type SlaType = z.infer<typeof SlaTypeEnumSchema>;
export const SlaTypeEnum = SlaTypeEnumSchema.enum;

export const SlaActionEnumSchema = z.enum(["start", "stop", "pause", "resume"]);
export type SlaAction = z.infer<typeof SlaActionEnumSchema>;
export const SlaActionEnum = SlaActionEnumSchema.enum;

export const SlaOperatorEnumSchema = z.enum([
  "equals",
  "not_equals",
  "in",
  "not_in",
  "contains",
]);
export type SlaOperator = z.infer<typeof SlaOperatorEnumSchema>;
export const SlaOperatorEnum = SlaOperatorEnumSchema.enum;

export const SlaEventEnumSchema = z.enum(["sla.breached", "sla.warning"]);
export type SlaEvent = z.infer<typeof SlaEventEnumSchema>;
export const SlaEventEnum = SlaEventEnumSchema.enum;

// ─────────────────────────────────────────────────────────────────────────────
// Nested rule schemas
// ─────────────────────────────────────────────────────────────────────────────

export const SlaConditionSchema = z.object({
  field: z.string(),
  operator: SlaOperatorEnumSchema,
  value: z.unknown(), // "$null$" prefix for null checks
});
export type SlaCondition = z.infer<typeof SlaConditionSchema>;

export const SlaTriggerSchema = z.object({
  event: z.string(), // e.g. "case.created", "case.status.changed"
  conditions: z.array(SlaConditionSchema).optional(),
  action: SlaActionEnumSchema,
});
export type SlaTrigger = z.infer<typeof SlaTriggerSchema>;

export const SlaTargetRulesSchema = z.object({
  startTriggers: z.array(SlaTriggerSchema),
  stopTriggers: z.array(SlaTriggerSchema),
  pauseTriggers: z.array(SlaTriggerSchema),
  resumeTriggers: z.array(SlaTriggerSchema),
});
export type SlaTargetRules = z.infer<typeof SlaTargetRulesSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Write model (DTO / form submission shape)
// THIS is the breakpoint: rename "type" here → TS errors in entity + web form
// ─────────────────────────────────────────────────────────────────────────────

export const SlaTargetWriteSchema = z.object({
  type: SlaTypeEnumSchema,
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  goalMs: z.number().int().min(1, { message: "Goal must be at least 1ms." }),
  rules: SlaTargetRulesSchema,
  isActive: z.boolean(),
});
export type SlaTargetDto = z.infer<typeof SlaTargetWriteSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Read model (what the API returns — write model + server-generated fields)
// ─────────────────────────────────────────────────────────────────────────────

export const SlaTargetReadSchema = SlaTargetWriteSchema.extend({
  id: z.uuid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type SlaTargetSchema = z.infer<typeof SlaTargetReadSchema>;

// *************************
// ** departments **
// *************************

// ─────────────────────────────────────────────────────────────────────────────
// Departments
// ─────────────────────────────────────────────────────────────────────────────

export const DepartmentWriteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  isActive: z.boolean(),
});
export type DepartmentDto = z.infer<typeof DepartmentWriteSchema>;

export const DepartmentReadSchema = DepartmentWriteSchema.extend({
  id: z.uuid(),
  key: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type DepartmentSchema = z.infer<typeof DepartmentReadSchema>;

// *************************
// ** roles **
// *************************

// ─────────────────────────────────────────────────────────────────────────────
// Write model (DTO / form submission shape)
// ─────────────────────────────────────────────────────────────────────────────

export const RoleWriteSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});
export type RoleDto = z.infer<typeof RoleWriteSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Read model (what the API returns — write model + server-generated fields)
// ─────────────────────────────────────────────────────────────────────────────

export const RoleReadSchema = RoleWriteSchema.omit({
  permissionIds: true,
}).extend({
  id: z.uuid(),
  key: z.string(),
  permissionCount: z.number(),
  userCount: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type RoleSchema = z.infer<typeof RoleReadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Assignment Schemas (bulk operations)
// ─────────────────────────────────────────────────────────────────────────────

export const RoleAssignPermissionsSchema = z.object({
  permissionIds: z.array(z.uuid()),
});
export type RoleAssignPermissionsDto = z.infer<
  typeof RoleAssignPermissionsSchema
>;

export const RoleAssignRolesSchema = z.object({
  roleIds: z.array(z.uuid()),
});
export type RoleAssignRolesDto = z.infer<typeof RoleAssignRolesSchema>;

// *************************
// ** permissions **
// *************************

// ─────────────────────────────────────────────────────────────────────────────
// Write model (DTO / form submission shape)
// ─────────────────────────────────────────────────────────────────────────────

export const PermissionWriteSchema = z.object({
  key: z.string().min(2, { message: "Key must be at least 2 characters." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  action: z.string().min(1, { message: "Action is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  description: z.string().optional(),
  conditions: z.record(z.string(), z.any()).optional(),
});
export type PermissionDto = z.infer<typeof PermissionWriteSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Read model (what the API returns — write model + server-generated fields)
// ─────────────────────────────────────────────────────────────────────────────

export const PermissionReadSchema = PermissionWriteSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type PermissionSchema = z.infer<typeof PermissionReadSchema>;

export const AssignUserPermissionsSchema = z.object({
  permissionIds: z.array(z.string().uuid()),
});
export type AssignUserPermissionsDto = z.infer<
  typeof AssignUserPermissionsSchema
>;

export const RevokePermissionsFromUserSchema = z.object({
  permissionIds: z.array(z.string().uuid()),
  metadata: z.record(z.string(), z.any()),
});
export type RevokePermissionsFromUserDto = z.infer<
  typeof RevokePermissionsFromUserSchema
>;

// *************************
// ** users **
// *************************

export const AuthSourceEnumSchema = z.enum(["local", "ldap"]);
export type AuthSource = z.infer<typeof AuthSourceEnumSchema>;
export const AuthSourceEnum = AuthSourceEnumSchema.enum;

export const UserMetadataSchema = z
  .object({
    mobile: z.string().optional(),
    title: z.string().optional(),
    company: z.string().optional(),
    employeeId: z.string().optional(),
    employeeType: z.string().optional(),
    location: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    userPrincipalName: z.string().optional(),
  })
  .catchall(z.any())
  .default({});

export const UserWriteSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address").optional().nullable(),
  avatar: z.string().optional(),
  authSource: AuthSourceEnumSchema,
  departmentId: z.string().uuid().optional(),
  phone: z.string().optional(),
  manager: z.string().optional(),
  password: z.string().optional(),
  externalId: z.string().optional(),
  isActive: z.boolean(),
  isLicensed: z.boolean(),
  metadata: UserMetadataSchema.optional(),
  roles: z.array(z.string().uuid()).optional(),
  permissions: z.array(z.string().uuid()).optional(),
  groups: z.array(z.string().uuid()).optional(),
});
export type UserDto = z.infer<typeof UserWriteSchema>;

export const UserReadSchema = UserWriteSchema.omit({
  roles: true,
  permissions: true,
  groups: true,
  password: true,
}).extend({
  id: z.string().uuid(),
  displayName: z.string().optional(),
  department: DepartmentReadSchema.optional(),
  roles: z.array(RoleReadSchema).optional(),
  permissions: z.array(PermissionReadSchema).optional(),
  groups: z.array(z.lazy(() => GroupReadSchema)).optional(),
  lastLoginAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type UserSchema = z.infer<typeof UserReadSchema>;

export const BulkUserSchema = z.object({
  ids: z.array(z.string().uuid()),
  data: UserWriteSchema.partial(),
});
export type BulkUserDto = z.infer<typeof BulkUserSchema>;

// *************************
// ** business lines **
// *************************

export const BusinessLineWriteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(1, "Key is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type BusinessLineDto = z.infer<typeof BusinessLineWriteSchema>;

export const BusinessLineReadSchema = BusinessLineWriteSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type BusinessLineSchema = z.infer<typeof BusinessLineReadSchema>;

// *************************
// ** groups **
// *************************

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

export const GroupTypeEnumSchema = z.enum([
  "help-desk",
  "tier-1",
  "tier-2",
  "vendor",
]);
export type GroupType = z.infer<typeof GroupTypeEnumSchema>;
export const GroupTypeEnum = GroupTypeEnumSchema.enum;

// ─────────────────────────────────────────────────────────────────────────────
// Write model (DTO / form submission shape)
// ─────────────────────────────────────────────────────────────────────────────

export const GroupWriteSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(120, { message: "Name must be at most 120 characters." }),
  type: GroupTypeEnumSchema,
  description: z.string().optional(),
  teamLeaderId: z.uuid().optional(),
  departmentId: z.uuid().optional(),
  businessLineId: z.uuid(),
  roles: z.array(z.uuid()).optional(),
  permissions: z.array(PermissionReadSchema).optional(),
  users: z.array(UserReadSchema).optional(),
});
export type GroupDto = z.infer<typeof GroupWriteSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Read model (what the API returns — write model + server-generated fields)
// ─────────────────────────────────────────────────────────────────────────────

export const GroupReadSchema: z.ZodType<any> = GroupWriteSchema.extend({
  id: z.uuid(),
  teamLeader: z.lazy(() => UserReadSchema).optional(),
  department: DepartmentReadSchema.optional(),
  businessLine: BusinessLineReadSchema.optional(),
  roles: RoleReadSchema.array(),
  permissions: PermissionReadSchema.array(),
  users: z.lazy(() => UserReadSchema.array()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type GroupSchema = z.infer<typeof GroupReadSchema>;
