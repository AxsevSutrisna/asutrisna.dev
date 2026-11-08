import { create } from "zustand"
import { achievementRepository } from "@/entities/achievement/api/achievementRepository"
import type { Achievement } from "@/entities/achievement/model/types"

interface AchievementState {
  achievements: Achievement[]
  loading: boolean
  error: string | null
  fetchAchievements: (force?: boolean) => Promise<void>
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  loading: false,
  error: null,

  fetchAchievements: async (force = false) => {
    if (!force && get().achievements.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await achievementRepository.fetchAll()
      set({ achievements: data, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      })
    }
  },
}))
