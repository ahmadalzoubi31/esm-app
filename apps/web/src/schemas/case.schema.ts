import { z } from 'zod'
import { CaseStatus, CasePriority } from '@/types/cases'

export const CaseSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters.' })
    .max(200, { message: 'Title must be at most 200 characters.' }),
  description: z.string().optional(),
  status: z.enum(CaseStatus).optional(),
  priority: z.enum(CasePriority).optional(),
  categoryId: z.uuid({ message: 'Please select a category.' }),
  subcategoryId: z.uuid().optional(),
  requesterId: z.uuid({ message: 'Please select a requester.' }),
  assigneeId: z.uuid().optional(),
  assignmentGroupId: z.uuid({
    message: 'Please select an assignment group.',
  }),
  businessLineId: z.uuid({ message: 'Please select a business line.' }),
  affectedServiceId: z.uuid({
    message: 'Please select an affected service.',
  }),
  requestCardId: z.uuid().optional(),
})

export const UpdateCaseSchema = CaseSchema
