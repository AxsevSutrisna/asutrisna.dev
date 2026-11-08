import { create } from "zustand"
import { projectRepository } from "@/entities/project/api/projectRepository"
import type { Project } from "@/entities/project/model/types"

interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  /**
   * Muat daftar project (publik). Cache naif: skip bila sudah ada data,
   * kecuali `force`. Setelah mutasi (Phase 1b) WAJIB panggil dengan force=true.
   */
  fetchProjects: (force?: boolean) => Promise<void>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async (force = false) => {
    if (!force && get().projects.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await projectRepository.fetchAll()
      set({ projects: data, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      })
    }
  },
}))
