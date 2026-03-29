import { z } from 'zod'
import { CaseStatus, CasePriority } from '@/types/cases'

/**
 * BEST PRACTICE: Read vs Write Models
 *
 * This is the Base schema for Forms (Write Model).
 * Forms only need the IDs for nested relationships (like businessLineId).
 * When fetching data (Read Model), the backend returns the full nested objects,
 * which are typed via TypeScript interfaces (like `Case` in `types/cases.ts`), not Zod.
 */
export const CaseFormBaseSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters.' })
    .max(50, { message: 'Title must be at most 50 characters.' }),
  description: z.string().optional(),
  categoryId: z.uuid({ message: 'Please select a category.' }),
  subcategoryId: z.union([z.uuid(), z.literal('')]).optional(),
  requesterId: z.uuid({ message: 'Please select a requester.' }),
  assigneeId: z.union([z.uuid(), z.literal('')]).optional(),
  assignmentGroupId: z.uuid({
    message: 'Please select an assignment group.',
  }),
  businessLineId: z.uuid({ message: 'Please select a business line.' }),
  affectedServiceId: z.uuid({
    message: 'Please select an affected service.',
  }),
  requestCardId: z.union([z.uuid(), z.literal('')]).optional(),
})

export const CreateCaseSchema = CaseFormBaseSchema.extend({
  status: z.enum(CaseStatus),
  priority: z.enum(CasePriority),
})

export const UpdateCaseSchema = CaseFormBaseSchema.extend({
  status: z.enum(CaseStatus),
  priority: z.enum(CasePriority),
}).omit({
  title: true,
  businessLineId: true,
})
