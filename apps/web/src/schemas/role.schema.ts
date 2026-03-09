import z from 'zod'

export const RoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  permissionCount: z.number().optional(),
  userCount: z.number().optional(),
  permissions: z.array(z.string()),
})
