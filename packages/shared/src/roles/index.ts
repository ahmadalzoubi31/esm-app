import { z } from "zod";

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
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Role = z.infer<typeof RoleReadSchema>;

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
