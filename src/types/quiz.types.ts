export interface Quiz {
  id: string;
  quiz_type_id: string;
  quiz_type: string;
  code: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  amount_questions: string;
  amount_assigned: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total_data: number;
  total_pages: number;
}

export interface QuizResponse {
  status_code: number;
  message: string;
  data: Quiz[];
  pagination: Pagination;
}

export interface CreateQuizRequest {
  quiz_type_id: string;
  code: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}
