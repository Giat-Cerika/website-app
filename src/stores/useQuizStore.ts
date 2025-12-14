import { create } from "zustand";
import { Quiz, Pagination } from "@/types/quiz.types";
import { quizService } from "@/services/quiz.service";

interface QuizState {
  quizes: Quiz[];
  selectedQuiz: Quiz | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    per_page: number;
    total_data: number;
    total_pages: number;
  } | null;

  fetchQuizes: (params?: any) => Promise<void>;
  fetchQuizById: (id: string) => Promise<void>;
  createQuiz: (data: any) => Promise<Quiz>;
  updateQuiz: (id: string, data: any) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quizes: [],
  selectedQuiz: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchQuizes: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await quizService.getQuiz(params);

      const mappedQuizes: Quiz[] = res.data.map((item: any) => ({
        id: item.id,
        quiz_type_id: item.quiz_type_id,
        quiz_type: item.quiz_type,
        code: item.code,
        title: item.title,
        description: item.description,
        start_date: item.start_date,
        end_date: item.end_date,
        status: item.status === 1 ? "Aktif" : "Nonaktif",
        amount_questions: item.amount_questions,
        amount_assigned: item.amount_assigned,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      set({
        quizes: mappedQuizes,
        pagination: res.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchQuizById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await quizService.getQuizById(id);

      const mappedQuiz: Quiz = {
        id: res.id,
        quiz_type_id: res.quiz_type_id,
        quiz_type: res.quiz_type,
        code: res.code,
        title: res.title,
        description: res.description,
        start_date: res.start_date,
        end_date: res.end_date,
        status: res.status,
        amount_questions: res.amount_questions,
        amount_assigned: res.amount_assigned,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set({ selectedQuiz: mappedQuiz, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createQuiz: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await quizService.createQuiz(data);

      const mappedQuiz: Quiz = {
        id: res.id,
        quiz_type_id: res.quiz_type_id,
        quiz_type: res.quiz_type,
        code: res.code,
        title: res.title,
        description: res.description,
        start_date: res.start_date,
        end_date: res.end_date,
        status: res.status,
        amount_questions: res.amount_questions,
        amount_assigned: res.amount_assigned,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set((state) => ({
        quizes: [mappedQuiz, ...state.quizes],
        isLoading: false,
      }));

      return mappedQuiz;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateQuiz: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await quizService.updateQuiz(id, data);

      const mappedQuiz: Quiz = {
        id: res.id,
        quiz_type_id: res.quiz_type_id,
        quiz_type: res.quiz_type,
        code: res.code,
        title: res.title,
        description: res.description,
        start_date: res.start_date,
        end_date: res.end_date,
        status: res.status,
        amount_questions: res.amount_questions,
        amount_assigned: res.amount_assigned,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set({
        quizes: get().quizes.map((c) => (c.id === id ? mappedQuiz : c)),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteQuiz: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await quizService.deleteQuiz(id);
      set({
        quizes: get().quizes.filter((c) => c.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
