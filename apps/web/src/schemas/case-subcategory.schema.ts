import { z } from 'zod'

export const CaseSubcategorySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  category_id: z.string().min(1, { message: 'Please select a case category.' }),
})
