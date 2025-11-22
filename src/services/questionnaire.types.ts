// services/questionnaire.service.ts
import { questionnaireRepository } from '@/repositories';
import { Questionnaire, QuestionnaireResponse } from '@/types/questionnaire.types';
import { PaginationParams } from '@/types/common.types';

export class QuestionnaireService {
  async getQuestionnaires(params?: PaginationParams) {
    try {
      return await questionnaireRepository.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch questionnaires');
    }
  }

  async getQuestionnaireById(id: string): Promise<Questionnaire> {
    try {
      return await questionnaireRepository.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch questionnaire');
    }
  }

  async createQuestionnaire(data: Partial<Questionnaire>): Promise<Questionnaire> {
    try {
      return await questionnaireRepository.create(data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create questionnaire');
    }
  }

  async updateQuestionnaire(id: string, data: Partial<Questionnaire>): Promise<Questionnaire> {
    try {
      return await questionnaireRepository.update(id, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update questionnaire');
    }
  }

  async deleteQuestionnaire(id: string): Promise<void> {
    try {
      await questionnaireRepository.delete(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete questionnaire');
    }
  }

  async submitResponse(
    questionnaireId: string,
    answers: Record<string, any>
  ): Promise<QuestionnaireResponse> {
    try {
      return await questionnaireRepository.submitResponse(questionnaireId, answers);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit response');
    }
  }

  async getResponses(questionnaireId: string): Promise<QuestionnaireResponse[]> {
    try {
      return await questionnaireRepository.getResponses(questionnaireId);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch responses');
    }
  }
}

export const questionnaireService = new QuestionnaireService();