export interface IListResponse<T> {
  list: T[];
  total: number;
  page?: number;
  perPage?: number;
}

export interface ISuccessResponse<T> {
  code: number;
  success: boolean;
  data: IListResponse<T> | T | Partial<T>;
  msg: string;
}
