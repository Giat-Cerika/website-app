import { create } from 'zustand';
import { Class } from '@/types/class.types';
import { classService } from '@/services/class.service';

interface ClassState {
  classes: Class[];
  selectedClass: Class | null;
  isLoading: boolean;
  error: string | null;

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
  isLoading: false,
  error: null,

  fetchClasses: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await classService.getClass(params);

      const mappedClass: Class[] = response.data.map((item: any) => ({
        id: item.id,
        name_class: item.name_class,
        grade: item.grade,
        teacher: item.teacher,
        createdAt: item.created_at, 
        updatedAt: item.updated_at,
      }));

      set({ classes: mappedClass, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchClassById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const clas = await classService.getClassById(id);
      set({ selectedClass: clas, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createClass: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newClass = await classService.createClass(data);
      const mappedClass = {
        id: newClass.id,
        name_class: newClass.name_class,
        grade: newClass.grade,
        teacher: newClass.teacher,
        createdAt: newClass.createdAt,
        updatedAt: newClass.updatedAt,
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
      const updatedClass = await classService.updateClass(id, data);
      set({
        classes: get().classes.map((c) => (c.id === id ? updatedClass : c)),
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
      set({ classes: get().classes.filter((c) => c.id !== id), isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
