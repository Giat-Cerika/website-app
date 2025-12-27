// types/quiz-history.types.ts

export interface DetailHistory {
  id: string;
  student_name: string;
  class: string;
  score: number;
  max_score: number;
  percentage: number;
  status: string;
  status_category: number;
  started_at: string;
  completed_at: string;
  created_at: string;
}

export interface QuizHistory {
  quiz_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  detail_histories: DetailHistory[];
}

export interface QuizHistoryResponse {
  status_code: number;
  message: string;
  data: QuizHistory[];
}

export interface QuizHistoryStats {
  total: number;
  avgScore: string;
  completed: number;
}

export enum StatusCategory {
  BAIK = 1,
  SEDANG = 2,
  BURUK = 3
}

export interface StatusInfo {
  label: string;
  color: string;
}