import { DepartmentWriteSchema } from '@repo/shared'
import { z } from 'zod'

export const DepartmentSchema = DepartmentWriteSchema

export type DepartmentFormValues = z.infer<typeof DepartmentSchema>
