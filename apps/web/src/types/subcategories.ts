import { Category } from './categories'

export interface Subcategory {
  id: string
  name: string
  description?: string
  category: Category
  createdAt: string
  updatedAt: string
}

export interface CreateSubcategoryDto {
  name: string
  description?: string
  category_id: string
}

export type UpdateSubcategoryDto = Partial<CreateSubcategoryDto>

export interface BulkUpdateSubcategoryDto {
  ids: string[]
  data: UpdateSubcategoryDto
}
