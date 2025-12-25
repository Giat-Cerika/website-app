import { create } from "zustand";
import { Class, Pagination } from "@/types/class.types";
import { classService } from "@/services/class.service";

interface ClassState {
  classes: Class[];
  selectedClass: Class | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    per_page: number;
    total_data: number;
    total_pages: number;
  } | null;
  total: number;

  fetchClasses: (params?: any) => Promise<void>;
  fetchClassById: (id: string) => Promise<void>;
  createClass: (data: any) => Promise<Class>;
  updateClass: (id: string, data: any) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  selectedClass: null,
  pagination: null,
  isLoading: false,
  error: null,
  total: 0,

  fetchClasses: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await classService.getClass(params);

      const mappedClasses: Class[] = res.data.map((item: any) => ({
        id: item.id,
        name_class: item.name_class,
        grade: item.grade,
        teacher: item.teacher,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      set({
        classes: mappedClasses,
        pagination: res.pagination,
        isLoading: false,
        total: res.pagination.total_data ?? 0,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchClassById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await classService.getClassById(id);

      const mappedClass: Class = {
        id: res.id,
        name_class: res.name_class,
        grade: res.grade,
        teacher: res.teacher,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set({ selectedClass: mappedClass, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createClass: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await classService.createClass(data);

      const mappedClass: Class = {
        id: res.id,
        name_class: res.name_class,
        grade: res.grade,
        teacher: res.teacher,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set((state) => ({
        classes: [mappedClass, ...state.classes],
        isLoading: false,
      }));

      return mappedClass;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateClass: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await classService.updateClass(id, data);

      const mappedClass: Class = {
        id: res.id,
        name_class: res.name_class,
        grade: res.grade,
        teacher: res.teacher,
        created_at: res.created_at,
        updated_at: res.updated_at,
      };

      set({
        classes: get().classes.map((c) => (c.id === id ? mappedClass : c)),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteClass: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await classService.deleteClass(id);
      set({
        classes: get().classes.filter((c) => c.id !== id),
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
