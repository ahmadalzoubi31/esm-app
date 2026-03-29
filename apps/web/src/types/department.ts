import type { Department } from '@repo/shared'

export type { Department, DepartmentDto } from '@repo/shared'

export interface DepartmentResponse {
  data: Department[]
}
