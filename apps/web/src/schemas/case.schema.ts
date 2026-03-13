import { z } from 'zod'
import { CaseStatus, CasePriority } from '@/types/cases'

export const CaseSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  description: z.string().optional(),
  status: z.nativeEnum(CaseStatus),
  priority: z.nativeEnum(CasePriority),
  categoryId: z.string().min(1, { message: 'Please select a category.' }),
  subcategoryId: z.string().optional(),
  requesterId: z.string().min(1, { message: 'Please select a requester.' }),
  assigneeId: z.string().optional(),
  assignmentGroupId: z
    .string()
    .min(1, { message: 'Please select an assignment group.' }),
  businessLineId: z
    .string()
    .min(1, { message: 'Please select a business line.' }),
  affectedServiceId: z.string().optional(),
  requestCardId: z.string().optional(),
})
