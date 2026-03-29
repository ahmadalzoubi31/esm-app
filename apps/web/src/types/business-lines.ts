export interface BusinessLine {
  id: string
  name: string
  key: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBusinessLineDto {
  name: string
  key: string
  description?: string
  active?: boolean
}

export type UpdateBusinessLineDto = Partial<CreateBusinessLineDto>
