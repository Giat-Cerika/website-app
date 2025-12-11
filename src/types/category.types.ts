export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total_data: number;
  total_pages: number;
}

export interface CategoryResponse {
  status_code: number;
  message: string;
  data: Category[];
  pagination: Pagination;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}
