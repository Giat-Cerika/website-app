import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';
import { Quiz, CreateQuizRequest } from '@/types/quiz.types';
import { PaginationParams } from '@/types/common.types';

export class QuizRepository {
  endpoint = API_ENDPOINTS.QUIZ.BASE;

  async create(data: CreateQuizRequest): Promise<Quiz> {
    return (await axiosInstance.post(`${this.endpoint}/create`, data)).data;
  }

  async getAll(params?: PaginationParams): Promise<{ data: Quiz[]; pagination: any }> {
    return (await axiosInstance.get(`${this.endpoint}/all`, { params })).data;
  }

  async getById(id: string): Promise<Quiz> {
    return (await axiosInstance.get(`${this.endpoint}/${id}`)).data.data;
  }

  async update(id: string, data: Partial<CreateQuizRequest>): Promise<Quiz> {
    return (await axiosInstance.put(`${this.endpoint}/${id}/edit`, data)).data;
  }

  async delete(id: string): Promise<void> {
    return (await axiosInstance.delete(`${this.endpoint}/${id}/delete`)).data;
  }

  async incrementViewCount(id: string): Promise<void> {
    return (await axiosInstance.post(`${this.endpoint}/${id}/view`)).data;
  }

  async updateStatus(id: string, status: number): Promise<Quiz> {
    const payload = { status };

    const response = await axiosInstance.put(
      `${this.endpoint}/${id}/update-status`,
      payload
    );


    return response.data;
  }

  async updateOrder(
    id: string,
    payload: { question_order_mode: "random" | "sequential" }
  ): Promise<Quiz> {
    const response = await axiosInstance.put(
      `${this.endpoint}/${id}/update-question-order-mode`,
      payload
    );
    return response.data;
  }

}
