// lib/types/api.ts
// Common API types and interfaces

/**
 * Standard API error response
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Standard success response
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Query parameters for list endpoints
 */
export interface ListParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}



