import type { SortDirection } from '@react-types/shared';

import type { SpotTableColumns } from '@/actions/spot-actions';

export type URLSearchParams = {
  search?: string | null;
  direction?: string | null;
  column?: string | null;
  page?: string | null;
};

type ValidatedSearchParams = {
  search?: string;
  direction: SortDirection;
  column: SpotTableColumns;
  page: number;
};

export const validateSearchParams = (params: URLSearchParams) => {
  const searchParams: ValidatedSearchParams = {
    search: params.search ?? undefined,
    direction: 'descending',
    column: 'created_at',
    page: 1,
  };

  // Validate direction
  if (params.direction && !['ascending', 'descending'].includes(params.direction)) {
    searchParams.direction = 'descending';
  } else if (params.direction) {
    searchParams.direction = params.direction as SortDirection;
  }

  // Validate column
  const columns: SpotTableColumns[] = ['name', 'address', 'city', 'state', 'zip', 'bust_level', 'created_at'];

  if (params.column && typeof params.column !== 'string' && !columns.includes(params.column)) {
    searchParams.column = 'created_at';
  } else if (params.column) {
    searchParams.column = params.column as SpotTableColumns;
  }

  // Validate page
  if (params.page && isNaN(Number(params.page))) {
    searchParams.page = 1;
  } else if (params.page) {
    searchParams.page = Number(params.page);
  }

  return searchParams;
};
