import {
  PaginationMeta,
  PaginatedResponse,
} from '@/types/models/v1/pagination.types';

export class PaginationResource {
  static toResponse<T>(
    data: T[],
    pagination: PaginationMeta
  ): PaginatedResponse<T> {
    return {
      data,
      pagination: {
        total: pagination.total,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: pagination.total_pages,
        has_next_page: pagination.has_next_page,
        has_previous_page: pagination.has_previous_page,
      },
    };
  }

  static emptyResponse<T>(): PaginatedResponse<T> {
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        per_page: 10,
        total_pages: 0,
        has_next_page: false,
        has_previous_page: false,
      },
    };
  }

  static fromRepositoryResult<T>(result: {
    data: T[];
    pagination: PaginationMeta;
  }): PaginatedResponse<T> {
    return this.toResponse(result.data, result.pagination);
  }
}
