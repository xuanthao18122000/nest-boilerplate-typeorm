export enum SORT_TYPE {
  'DESC' = 'desc',
  'ASC' = 'acs',
}

export type ResponseType<T> = {
  code: number;
  data: T[];
  msg: string;
  success: boolean;
};

export type FindAllResponse<T> = {
  list: T[];
  total: number;
  page: number;
  perPage: number;
};

export type SortParams = { sort_by: string; sort_type: SORT_TYPE };

export type SearchParams = { keywork: string; field: string };

export type PaginateParams = { offset: number; limit: number };
