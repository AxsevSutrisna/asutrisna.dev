import { create } from "zustand"
import { techStackRepository } from "@/entities/techStack/api/techStackRepository"
import type { TechStack } from "@/entities/techStack/model/types"

interface TechStackState {
  techStacks: TechStack[]
  loading: boolean
  error: string | null
  fetchTechStacks: (force?: boolean) => Promise<void>
}

export const useTechStackStore = create<TechStackState>((set, get) => ({
  techStacks: [],
  loading: false,
  error: null,

  // Website publik hanya menampilkan tech stack aktif.
  fetchTechStacks: async (force = false) => {
    if (!force && get().techStacks.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await techStackRepository.fetchActive()
      set({ techStacks: data, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      })
    }
  },
}))
