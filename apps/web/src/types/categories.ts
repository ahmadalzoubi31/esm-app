import { Subcategory } from './subcategories';

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  subcategories?: Subcategory[]
}

export interface CreateCategoryDto {
  name: string
  description?: string
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>

export interface BulkUpdateCategoryDto {
  ids: string[]
  data: UpdateCategoryDto
}
