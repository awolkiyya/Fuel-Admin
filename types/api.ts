export interface ApiError {
  message: string
  status?: number
  code?: string
  data?: any
}
  
  export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  export interface ApiResponse<T = unknown, M = unknown, S = unknown> {
    success: boolean;
    message?: string;
  
    data?: T;
    meta?: M;
    summary?: S;
  
    error?: ApiError;
  }
  
  export type SingleResponse<T> = ApiResponse<T>
  export type ListResponse<T> = ApiResponse<T[]>
  export type PaginatedResponse<T, S = unknown> = ApiResponse<
  T[],
  PaginationMeta,
  S
>;  
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  request_id?: string;
  timestamp?: string;
}
  