import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants';
import { Prediction } from '@/types/prediction.types';
import { PaginationParams } from '@/types/common.types';

export class PredictionRepository {
  endpoint = API_ENDPOINTS.PREDICTION.BASE;

  async getAll(params?: PaginationParams): Promise<{ data: Prediction[]; pagination: any }> {
    return (await axiosInstance.get(`${this.endpoint}/all`, { params })).data;
  }

  async getById(id: string): Promise<Prediction> {
    return (await axiosInstance.get(`${this.endpoint}/${id}`)).data;
  }

  async delete(id: string): Promise<void> {
    return (await axiosInstance.delete(`${this.endpoint}/${id}/delete`)).data;
  }
}

export const predictionRepository = new PredictionRepository();