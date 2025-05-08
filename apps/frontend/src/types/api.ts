import { Product } from '@product-inventory/shared-types';

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ProductsResponse = PaginatedResponse<Product>; 