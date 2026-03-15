import z from 'zod'

export const BusinessLineSchema = z.object({
  key: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  active: z.boolean().default(true).optional(),
})

export const CreateBusinessLineSchema = BusinessLineSchema
export const UpdateBusinessLineSchema = BusinessLineSchema.partial()
