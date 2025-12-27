// stores/useQuizHistoryStore.ts

import { create } from "zustand";
import { QuizHistory } from "@/types/quiz-history.types";
import { quizHistoryService } from "@/services/quiz-history.service";

interface QuizHistoryState {
  // State
  quizHistories: QuizHistory[];
  selectedQuizHistory: QuizHistory | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchQuizHistories: () => Promise<void>;
  fetchQuizHistoryById: (quizId: string) => Promise<void>;
  setSelectedQuizHistory: (quiz: QuizHistory | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  quizHistories: [],
  selectedQuizHistory: null,
  isLoading: false,
  error: null,
};

export const useQuizHistoryStore = create<QuizHistoryState>((set, get) => ({
  ...initialState,

  /**
   * Fetch all quiz histories from API
   */
  fetchQuizHistories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await quizHistoryService.getQuizHistories();
      set({
        quizHistories: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch quiz histories',
        isLoading: false,
      });
      console.error('Error fetching quiz histories:', error);
    }
  },

  /**
   * Fetch single quiz history by ID
   */
  fetchQuizHistoryById: async (quizId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await quizHistoryService.getQuizHistoryById(quizId);
      set({
        selectedQuizHistory: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch quiz history',
        isLoading: false,
      });
      console.error('Error fetching quiz history:', error);
    }
  },

  /**
   * Set selected quiz history manually
   */
  setSelectedQuizHistory: (quiz: QuizHistory | null) => {
    set({ selectedQuizHistory: quiz });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set(initialState);
  },
}));