import z from 'zod'

export const GroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  teamLeaderId: z.string().optional(),
  departmentId: z.string().optional(),
  businessLineId: z.string().min(1, 'Business Line is required'),
  roles: z.array(z.string()).default([]).optional(),
  permissions: z.array(z.string()).default([]).optional(),
  users: z.array(z.string()).default([]).optional(),
})

export const CreateGroupSchema = GroupSchema
export const UpdateGroupSchema = GroupSchema.partial()
