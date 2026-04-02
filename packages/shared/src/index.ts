// Removed MikroORM import to prevent browser errors (os.platform is not a function)
// import { Collection } from "@mikro-orm/core";

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
  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
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
  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type DepartmentSchema = z.infer<typeof DepartmentReadSchema>;

// *************************
// ** roles **
// *************************

// ─────────────────────────────────────────────────────────────────────────────
// Write model (DTO / form submission shape)
// ─────────────────────────────────────────────────────────────────────────────

export const RoleWriteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  permissionIds: z.array(z.union([z.uuid(), z.literal("")])).optional(),
});
export type RoleDto = z.infer<typeof RoleWriteSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Read model (what the API returns — write model + server-generated fields)
// ─────────────────────────────────────────────────────────────────────────────

export const RoleReadSchema = RoleWriteSchema.omit({
  permissionIds: true,
}).extend({
  id: z.uuid(),
  permissionCount: z.number().nonnegative().optional(),
  userCount: z.number().nonnegative().optional(),

  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
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
  id: z.uuid(),
  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type PermissionSchema = z.infer<typeof PermissionReadSchema>;

export const AssignUserPermissionsSchema = z.object({
  permissionIds: z.array(z.uuid()),
});
export type AssignUserPermissionsDto = z.infer<
  typeof AssignUserPermissionsSchema
>;

export const RevokePermissionsFromUserSchema = z.object({
  permissionIds: z.array(z.uuid()),
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
  email: z.email("Invalid email address").optional().nullable(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  manager: z.string().optional(),
  authSource: AuthSourceEnumSchema,
  departmentId: z.union([z.uuid(), z.literal("")]).optional(),
  externalId: z.string().optional(),
  password: z.string().optional(),
  isActive: z.boolean(),
  isLicensed: z.boolean(),
  metadata: UserMetadataSchema.optional(),
  roleIds: z.array(z.union([z.uuid(), z.literal("")])).optional(),
  permissionIds: z.array(z.union([z.uuid(), z.literal("")])).optional(),
  groupIds: z.array(z.union([z.uuid(), z.literal("")])).optional(),
});
export type UserDto = z.infer<typeof UserWriteSchema>;

export const UserReadSchema = UserWriteSchema.omit({
  roleIds: true,
  permissionIds: true,
  groupIds: true,
}).extend({
  id: z.uuid(),
  displayName: z.string().optional(),

  lastLoginAt: z.coerce.date().nullable().optional(),
  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type UserSchema = z.infer<typeof UserReadSchema>;

export const BulkUserSchema = z.object({
  ids: z.array(z.uuid()),
  data: UserWriteSchema.partial(),
});
export type BulkUserDto = z.infer<typeof BulkUserSchema>;

// *************************
// ** business lines **
// *************************

export const BusinessLineWriteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});
export type BusinessLineDto = z.infer<typeof BusinessLineWriteSchema>;

export const BusinessLineReadSchema = BusinessLineWriteSchema.extend({
  id: z.uuid(),
  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
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
    .min(1, "Name is required.")
    .max(120, "Name must be at most 120 characters."),
  type: GroupTypeEnumSchema,
  description: z.string().optional(),
  teamLeaderId: z.union([z.uuid(), z.literal("")]).optional(),
  businessLineId: z.uuid(),
  roleIds: z.array(z.uuid()).default([]).optional(),
  permissionIds: z.array(z.uuid()).default([]).optional(),
  userIds: z.array(z.uuid()).default([]).optional(),
  isActive: z.boolean(),
});
export type GroupDto = z.infer<typeof GroupWriteSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Read model (what the API returns — write model + server-generated fields)
// ─────────────────────────────────────────────────────────────────────────────

// Circular Dependency: Good job using z.lazy(() => UserReadSchema).
// Groups contain Users, and Users contain Groups.
// Without z.lazy, your code would crash with
// a "ReferenceError: Cannot access UserReadSchema before initialization."

export const GroupReadSchema = GroupWriteSchema.omit({
  roleIds: true,
  permissionIds: true,
  teamLeaderId: true,
  businessLineId: true,
  userIds: true,
}).extend({
  id: z.uuid(),
  teamLeader: UserReadSchema.optional(),
  businessLine: BusinessLineReadSchema,

  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type GroupSchema = z.infer<typeof GroupReadSchema>;
export type Group = GroupSchema;

// *************************
// ** categories **
// *************************

export const CategoryWriteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  subCategory: z.string().optional(),
  isActive: z.boolean(),
});
export type CategoryDto = z.infer<typeof CategoryWriteSchema>;

export const CategoryReadSchema = CategoryWriteSchema.extend({
  id: z.uuid(),
  description: z.string().optional(),
  subCategory: z.string().optional(),
  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type CategorySchema = z.infer<typeof CategoryReadSchema>;

// *************************
// ** sub-categories **
// *************************

export const SubCategoryWriteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});
export type SubCategoryDto = z.infer<typeof SubCategoryWriteSchema>;

export const SubCategoryReadSchema = CategoryWriteSchema.extend({
  id: z.uuid(),
  description: z.string().optional(),
  // Use .coerce to turn ISO strings from the API back into JS Dates
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type SubCategorySchema = z.infer<typeof CategoryReadSchema>;
