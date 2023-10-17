export const listResponse = <T>(
  list: Array<T>,
  total: number,
  page: number,
  perPage: number,
) => {
  return { list, total, page: Number(page), perPage: Number(perPage) };
};
