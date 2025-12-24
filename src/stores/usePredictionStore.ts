import { create } from "zustand";
import { Prediction, PredictionPagination } from "@/types/prediction.types";
import { predictionService } from "@/services/prediction.service";

interface PredictionState {
  predictions: Prediction[];
  selectedPrediction: Prediction | null;
  isLoading: boolean;
  error: string | null;
  pagination: PredictionPagination | null;

  fetchPredictions: (params?: any) => Promise<void>;
  fetchPredictionById: (id: string) => Promise<void>;
  deletePrediction: (id: string) => Promise<void>;
  clearError: () => void;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  predictions: [],
  selectedPrediction: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchPredictions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await predictionService.getPredictions(params);

      set({
        predictions: res.data,
        pagination: res.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPredictionById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await predictionService.getPredictionById(id);
      set({ selectedPrediction: res, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deletePrediction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await predictionService.deletePrediction(id);
      set({
        predictions: get().predictions.filter((p) => p.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));