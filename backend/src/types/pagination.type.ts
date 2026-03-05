export interface Pagination<T> {
  items: T[];
  page: number;
  totalItems: number;
  totalPages: number;
}
