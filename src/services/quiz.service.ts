import { quizRepository } from '@/repositories';
import { Quiz, CreateQuizRequest } from '@/types/quiz.types';
import { PaginationParams } from '@/types/common.types';

export class QuizService {
  async getQuiz(params?: PaginationParams) {
    try {
      return await quizRepository.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz');
    }
  }

  async getQuizById(id: string): Promise<Quiz> {
    try {
      return await quizRepository.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch quiz');
    }
  }

  async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
    try {
      return await quizRepository.create(data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create quiz');
    }
  }

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz> {
    try {
      return await quizRepository.update(id, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update quiz');
    }
  }

  async deleteQuiz(id: string): Promise<void> {
    try {
      await quizRepository.delete(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete quiz');
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await quizRepository.incrementViewCount(id);
    } catch (error: any) {
      console.error('Failed to increment view count:', error);
    }
  }
  
  async updateQuizStatus(id: string, status: number): Promise<Quiz> {
    return await quizRepository.updateStatus(id, status);
  }

  async updateQuizOrder(
    id: string,
    payload: { question_order_mode: "random" | "sequential" }
  ): Promise<Quiz> {
    return await quizRepository.updateOrder(id, payload);
  }

}

export const quizService = new QuizService();