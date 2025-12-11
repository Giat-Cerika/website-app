import { create } from "zustand";
import { Category, Pagination } from "@/types/category.types";
import { categoryService } from "@/services/category.service";

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    per_page: number;
    total_data: number;
    total_pages: number;
  } | null;

  fetchCategories: (params?: any) => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
  createCategory: (data: any) => Promise<Category>;
  updateCategory: (id: string, data: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategory: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchCategories: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.getCategory(params);

      const mappedCategories: Category[] = res.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      set({
        categories: mappedCategories,
        pagination: res.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCategoryById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.getCategoryById(id);

      const mappedCategory: Category = {
        id: res.id,
        name: res.name,
        description: res.description,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set({ selectedCategory: mappedCategory, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.createCategory(data);

      const mappedCategory: Category = {
        id: res.id,
        name: res.name,
        description: res.description,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set((state) => ({
        categories: [mappedCategory, ...state.categories],
        isLoading: false,
      }));

      return mappedCategory;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await categoryService.updateCategory(id, data);

      const mappedCategory: Category = {
        id: res.id,
        name: res.name,
        description: res.description,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set({
        categories: get().categories.map((c) => (c.id === id ? mappedCategory : c)),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoryService.deleteCategory(id);
      set({
        categories: get().categories.filter((c) => c.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
