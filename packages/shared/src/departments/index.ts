import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Departments
// ─────────────────────────────────────────────────────────────────────────────

export const DepartmentWriteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  active: z.boolean(),
});
export type DepartmentDto = z.infer<typeof DepartmentWriteSchema>;

export const DepartmentReadSchema = DepartmentWriteSchema.extend({
  id: z.uuid(),
  key: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
export type Department = z.infer<typeof DepartmentReadSchema>;
