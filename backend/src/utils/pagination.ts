export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function parsePagination(query: { page?: string; pageSize?: string }): PaginationParams {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize || '12', 10)));
  return { page, pageSize };
}

export function buildPaginationResult<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginationResult<T> {
  return {
    data,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize),
    },
  };
}
