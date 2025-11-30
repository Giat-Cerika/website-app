export interface Materi {
  id: string;
  title: string;
  description: string;
  cover: string;
  material_images: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMateriRequest {
  title: string;
  description: string;
  cover: File;
  gallery: File[];
}

export interface UpdateMateriRequest {
  title?: string;
  description?: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total_data: number;
  total_pages: number;
  next_page_url: string | null;
}

export interface MateriListResponse {
  status_code: number;
  message: string;
  data: Materi[];
  pagination: Pagination;
}

export interface MateriQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  per_page: number;
}