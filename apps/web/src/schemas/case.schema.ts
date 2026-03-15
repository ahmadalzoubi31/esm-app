import { z } from 'zod'
import { CaseStatus, CasePriority } from '@/types/cases'
import { GroupSchema } from './group.schema'

export const CaseSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters.' })
    .max(50, { message: 'Title must be at most 50 characters.' }),
  description: z.string().optional(),
  status: z.enum(CaseStatus),
  priority: z.enum(CasePriority),
  category: z.string().min(1, { message: 'Please select a category.' }),
  subcategory: z.string().optional(),
  requester: z.string().min(1, { message: 'Please select a requester.' }),
  assignee: z.string().optional(),
  assignmentGroup: GroupSchema
  businessLine: z
    .string()
    .min(1, { message: 'Please select a business line.' }),
  affectedService: z
    .string()
    .min(1, { message: 'Please select an affected service.' }),
  requestCard: z.string().optional(),
})

export const UpdateCaseSchema = CaseSchema
