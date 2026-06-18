import { create } from 'zustand';
import { techStackService } from '../services/techStackService';

export const useTechStackStore = create((set, get) => {
  let initialTechStacks = [];
  try {
    const cached = localStorage.getItem('techStacks');
    if (cached) initialTechStacks = JSON.parse(cached);
  } catch (e) {
    console.error(e);
  }

  return {
    techStacks: initialTechStacks,
    loading: false,
    error: null,

    fetchTechStacks: async () => {
      if (get().techStacks.length > 0) return;

      set({ loading: true, error: null });
      try {
        const data = await techStackService.fetchAll();
        set({ techStacks: data, loading: false });
        localStorage.setItem('techStacks', JSON.stringify(data));
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    }
  };
});
