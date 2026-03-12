export interface CaseCategory {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCaseCategoryDto {
  name: string
  description?: string
}

export type UpdateCaseCategoryDto = Partial<CreateCaseCategoryDto>

export interface BulkUpdateCaseCategoryDto {
  ids: string[]
  data: UpdateCaseCategoryDto
}
