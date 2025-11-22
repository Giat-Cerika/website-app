import { create } from 'zustand';
import { Article } from '@/types/article.types';
import { articleService } from '@/services/article.service';

interface ArticleState {
  articles: Article[];
  selectedArticle: Article | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchArticles: (params?: any) => Promise<void>;
  fetchArticleById: (id: string) => Promise<void>;
  createArticle: (data: any) => Promise<void>;
  updateArticle: (id: string, data: any) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  searchArticles: (query: string) => Promise<void>;
  clearError: () => void;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  selectedArticle: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  fetchArticles: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await articleService.getArticles(params);
      set({
        articles: response.data,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchArticleById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const article = await articleService.getArticleById(id);
      set({ selectedArticle: article, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createArticle: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newArticle = await articleService.createArticle(data);
      set((state) => ({
        articles: [newArticle, ...state.articles],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateArticle: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedArticle = await articleService.updateArticle(id, data);
      set((state) => ({
        articles: state.articles.map((article) =>
          article.id === id ? updatedArticle : article
        ),
        selectedArticle: updatedArticle,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteArticle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await articleService.deleteArticle(id);
      set((state) => ({
        articles: state.articles.filter((article) => article.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  searchArticles: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const articles = await articleService.searchArticles(query);
      set({ articles, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));