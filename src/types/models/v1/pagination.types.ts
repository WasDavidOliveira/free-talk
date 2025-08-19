export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
