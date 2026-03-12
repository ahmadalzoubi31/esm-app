import { z } from 'zod'
import { CaseStatus, CasePriority } from '@/types/cases'

export const CaseSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  description: z.string().optional(),
  status: z.nativeEnum(CaseStatus),
  priority: z.nativeEnum(CasePriority),
  category_id: z.string().min(1, { message: 'Please select a category.' }),
  subcategory_id: z.string().optional(),
  requester_id: z.string().min(1, { message: 'Please select a requester.' }),
  assignee_id: z.string().optional(),
  assignment_group_id: z.string().min(1, { message: 'Please select an assignment group.' }),
  business_line_id: z.string().min(1, { message: 'Please select a business line.' }),
  affected_service_id: z.string().optional(),
  request_card_id: z.string().optional(),
})
