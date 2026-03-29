export interface Category {
  id: string
  name: string
  description?: string
  tier: number
  parentId?: string
  parent?: Category
  children?: Category[]
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
  tier?: number
  parentId?: string
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>

export interface BulkUpdateCategoryDto {
  ids: string[]
  data: UpdateCategoryDto
}
