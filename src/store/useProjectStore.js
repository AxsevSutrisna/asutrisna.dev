import { create } from 'zustand';
import { projectService } from '../services/projectService';

export const useProjectStore = create((set, get) => {
  let initialProjects = [];
  try {
    const cached = localStorage.getItem('projects');
    if (cached) initialProjects = JSON.parse(cached);
  } catch (e) {
    console.error(e);
  }

  return {
    projects: initialProjects,
    loading: false,
    error: null,

    fetchProjects: async (force = false) => {
      if (!force && get().projects.length > 0) return;

      set({ loading: true, error: null });
      try {
        const data = await projectService.fetchAll();
        set({ projects: data, loading: false });
        localStorage.setItem('projects', JSON.stringify(data));
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    }
  };
});
