export interface Answer {
  answer_text: string;
  score_value: number;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_image?: string | null;
  answers: Answer[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateQuestionRequest {
  quiz_id: string;
  question_text: string;
  answers: Answer[];
  question_image?: File;
}
