import { CaseCategory } from './case-categories'

export interface CaseSubcategory {
  id: string
  name: string
  description?: string
  category: CaseCategory
  createdAt: string
  updatedAt: string
}

export interface CreateCaseSubcategoryDto {
  name: string
  description?: string
  category_id: string
}

export type UpdateCaseSubcategoryDto = Partial<CreateCaseSubcategoryDto>

export interface BulkUpdateCaseSubcategoryDto {
  ids: string[]
  data: UpdateCaseSubcategoryDto
}
