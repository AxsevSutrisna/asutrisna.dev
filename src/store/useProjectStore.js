import { create } from "zustand"
import { projectService } from "../services/projectService"

export const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async (force = false) => {
    if (!force && get().projects.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await projectService.fetchAll()
      set({ projects: data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
