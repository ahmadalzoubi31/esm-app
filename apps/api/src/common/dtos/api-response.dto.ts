export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiMeta {
  requestId?: string;
  pagination?: PaginationMeta;
  [key: string]: any;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  statusCode: number;
  errors?: Record<string, string[] | string>;
  meta?: ApiMeta;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
