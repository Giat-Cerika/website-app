import { questionRepository } from "@/repositories";
import {
  CreateQuestionRequest,
  Question,
} from "@/types/question.types";

export class QuestionService {
  async createQuestion(
    data: CreateQuestionRequest
  ): Promise<Question> {
    try {
      return await questionRepository.create(data);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create question"
      );
    }
  }

  async getQuestionsByQuizId(
    quizId: string
  ): Promise<Question[]> {
    try {
      return await questionRepository.getByQuizId(quizId);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch questions"
      );
    }
  }

  async deleteQuestion(id: string): Promise<void> {
    try {
      await questionRepository.delete(id);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete question"
      );
    }
  }
}

export const questionService = new QuestionService();
