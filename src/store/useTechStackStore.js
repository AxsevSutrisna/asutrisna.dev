import { create } from 'zustand';
import { techStackService } from '../services/techStackService';

export const useTechStackStore = create((set, get) => ({
  techStacks: [],
  loading: false,
  error: null,

  fetchTechStacks: async (force = false) => {
    if (!force && get().techStacks.length > 0) return;

    set({ loading: true, error: null });
    try {
      const data = await techStackService.fetchAll();
      set({ techStacks: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));
