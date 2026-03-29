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
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type SlaTarget = z.infer<typeof SlaTargetReadSchema>;
// ─────────────────────────────────────────────────────────────────────────────
// Departments
// ─────────────────────────────────────────────────────────────────────────────

export const DepartmentWriteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  active: z.boolean().default(true),
});
export type DepartmentDto = z.infer<typeof DepartmentWriteSchema>;

export const DepartmentReadSchema = DepartmentWriteSchema.extend({
  id: z.string().uuid(),
  code: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});
export type Department = z.infer<typeof DepartmentReadSchema>;
