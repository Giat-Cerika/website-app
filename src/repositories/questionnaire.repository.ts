import { BaseRepository } from './base.repository';
import { Questionnaire, QuestionnaireResponse } from '@/types/questionnaire.types';
import { API_ENDPOINTS } from '@/lib/constants';
import axiosInstance from '@/lib/axios';

export class QuestionnaireRepository extends BaseRepository<Questionnaire> {
  constructor() {
    super(API_ENDPOINTS.QUESTIONNAIRES.BASE);
  }

  async submitResponse(
    questionnaireId: string,
    answers: Record<string, any>
  ): Promise<QuestionnaireResponse> {
    const response = await axiosInstance.post<{ data: QuestionnaireResponse }>(
      API_ENDPOINTS.QUESTIONNAIRES.RESPONSES(questionnaireId),
      { answers }
    );
    return response.data.data;
  }

  async getResponses(questionnaireId: string): Promise<QuestionnaireResponse[]> {
    const response = await axiosInstance.get<{ data: QuestionnaireResponse[] }>(
      API_ENDPOINTS.QUESTIONNAIRES.RESPONSES(questionnaireId)
    );
    return response.data.data;
  }
}
