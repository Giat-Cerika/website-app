import { predictionRepository } from '@/repositories/prediction.repository';
import { Prediction } from '@/types/prediction.types';
import { PaginationParams } from '@/types/common.types';

export class PredictionService {
  async getPredictions(params?: PaginationParams) {
    try {
      return await predictionRepository.getAll(params);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch predictions');
    }
  }

  async getPredictionById(id: string): Promise<Prediction> {
    try {
      return await predictionRepository.getById(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch prediction');
    }
  }

  async deletePrediction(id: string): Promise<void> {
    try {
      await predictionRepository.delete(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete prediction');
    }
  }
}

export const predictionService = new PredictionService();