import { z } from 'zod'

export const DepartmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  active: z.boolean(),
})

export type DepartmentFormValues = z.infer<typeof DepartmentSchema>
