export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: any
}

export interface ApiErrorResponse {
  success: boolean
  message: string
  code: string
  statusCode: number
  meta?: any
}

export class ApiError extends Error {
  public code: string
  public statusCode: number
  public meta?: any

  constructor(response: ApiErrorResponse) {
    super(response.message)
    this.name = 'ApiError'
    this.code = response.code
    this.statusCode = response.statusCode
    this.meta = response.meta
  }
}
