export interface Class {
  id: string;
  name_class: string;
  grade: string;
  teacher: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total_data: number;
  total_pages: number;
}

export interface ClassResponse {
  status_code: number;
  message: string;
  data: Class[];
  pagination: Pagination;
}

export interface CreateClassRequest {
  name_class: string;
  grade: string;
  teacher: string;
}
