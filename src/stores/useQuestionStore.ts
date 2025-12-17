import { create } from "zustand";
import { Question } from "@/types/question.types";
import { questionService } from "@/services/question.service";

interface QuestionState {
  questions: Question[];
  isLoading: boolean;
  error: string | null;

  fetchQuestionsByQuizId: (quizId: string) => Promise<void>;
  createQuestion: (data: any) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  isLoading: false,
  error: null,

  fetchQuestionsByQuizId: async (quizId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await questionService.getQuestionsByQuizId(quizId);

      const mappedQuestions: Question[] = res.map((item: any) => ({
        id: item.id,
        quiz_id: item.quiz_id,
        question_text: item.question_text,
        question_image: item.question_image,
        answers: item.answers,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      set({ questions: mappedQuestions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createQuestion: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await questionService.createQuestion(data);

      const mappedQuestion: Question = {
        id: res.id,
        quiz_id: res.quiz_id,
        question_text: res.question_text,
        question_image: res.question_image,
        answers: res.answers,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set((state) => ({
        questions: [...state.questions, mappedQuestion],
        isLoading: false,
      }));

      return mappedQuestion;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteQuestion: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await questionService.deleteQuestion(id);

      set({
        questions: get().questions.filter((q) => q.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
