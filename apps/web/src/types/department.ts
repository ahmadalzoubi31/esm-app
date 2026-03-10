export interface Department {
  id: string
  name: string
  description?: string
  active: boolean
}

export interface DepartmentResponse {
  data: Department[]
}
