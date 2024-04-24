import { PaginationOptions } from '../builder/pagination-options.builder';

export const listResponse = <K extends PaginationOptions, T>(
  list: Array<T>,
  total: number,
  query?: K,
) => {
  if (query.getFull === true) {
    return { list, total };
  }
  return {
    list,
    total,
    page: Number(query.page),
    perPage: Number(query.perPage),
  };
};
