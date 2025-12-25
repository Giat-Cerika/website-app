import { create } from "zustand";
import { MateriService } from "@/services/material.service";
import {
  Materi,
  CreateMateriRequest,
  UpdateMateriRequest,
  MateriQueryParams,
} from "@/types/material.types";

interface MateriState {
  materi: Materi[];
  selectedMateri: Materi | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  
  fetchMateri: (params?: MateriQueryParams) => Promise<void>;
  getMateriById: (id: string) => Promise<void>;
  createMateri: (data: CreateMateriRequest) => Promise<boolean>;
  updateMateri: (id: string, data: UpdateMateriRequest) => Promise<boolean>;
  deleteMateri: (id: string) => Promise<boolean>;
  setSelectedMateri: (materi: Materi | null) => void;
  clearError: () => void;
}

const materiService = new MateriService();

export const useMateriStore = create<MateriState>((set, get) => ({
  materi: [],
  selectedMateri: null,
  isLoading: false,
  error: null,
  total: 0,

  fetchMateri: async (params) => {
    set({ isLoading: true, error: null });
    const result = await materiService.fetchMateri(params);
    
    if (result.success) {
      set({
        materi: result.data || [],
        total: result.pagination?.total_data ?? 0,
        isLoading: false,
      });
    } else {
      set({
        error: result.error || "Terjadi kesalahan",
        isLoading: false,
        materi: [],
      });
    }
  },

  getMateriById: async (id) => {
    set({ isLoading: true, error: null });
    const result = await materiService.getMateriById(id);
    
    if (result.success) {
      set({
        selectedMateri: result.data || null,
        isLoading: false,
      });
    } else {
      set({
        error: result.error || "Terjadi kesalahan",
        isLoading: false,
      });
    }
  },

  createMateri: async (data) => {
    set({ isLoading: true, error: null });
    const result = await materiService.createMateri(data);
    
    if (result.success) {
      // Refresh list after create
      await get().fetchMateri();
      set({ isLoading: false });
      return true;
    } else {
      set({
        error: result.error || "Terjadi kesalahan",
        isLoading: false,
      });
      return false;
    }
  },

  updateMateri: async (id, data) => {
    set({ isLoading: true, error: null });
    const result = await materiService.updateMateri(id, data);
    
    if (result.success) {
      // Update in local state
      set((state) => ({
        materi: state.materi.map((m) =>
          m.id === id ? { ...m, ...data } : m
        ),
        selectedMateri:
          state.selectedMateri?.id === id
            ? { ...state.selectedMateri, ...data }
            : state.selectedMateri,
        isLoading: false,
      }));
      return true;
    } else {
      set({
        error: result.error || "Terjadi kesalahan",
        isLoading: false,
      });
      return false;
    }
  },

  deleteMateri: async (id) => {
    set({ isLoading: true, error: null });
    const result = await materiService.deleteMateri(id);
    
    if (result.success) {
      set((state) => ({
        materi: state.materi.filter((m) => m.id !== id),
        isLoading: false,
      }));
      return true;
    } else {
      set({
        error: result.error || "Terjadi kesalahan",
        isLoading: false,
      });
      return false;
    }
  },

  setSelectedMateri: (materi) => {
    set({ selectedMateri: materi });
  },

  clearError: () => {
    set({ error: null });
  },
}));
