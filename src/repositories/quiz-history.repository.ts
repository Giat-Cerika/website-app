import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';
import { QuizHistory } from '@/types/quiz-history.types';

export class QuizHistoryRepository {
  endpoint = API_ENDPOINTS.QUIZ_HISTORY?.BASE;

  async getAll(): Promise<QuizHistory[]> {
    const response = await axiosInstance.get(`${this.endpoint}/all-student-history`);
    return response.data.data || response.data;
  }

  async getById(quizId: string): Promise<QuizHistory> {
    const response = await axiosInstance.get(`${this.endpoint}/${quizId}`);
    return response.data.data || response.data;
  }
}

export const quizHistoryRepository = new QuizHistoryRepository();