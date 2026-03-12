import { z } from 'zod'

export const CaseCategorySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
})
