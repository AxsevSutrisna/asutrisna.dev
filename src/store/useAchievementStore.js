import { create } from "zustand"
import { achievementService } from "../services/achievementService"

export const useAchievementStore = create((set, get) => ({
  achievements: [],
  loading: false,
  error: null,

  fetchAchievements: async (force = false) => {
    if (!force && get().achievements.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await achievementService.fetchAll()
      set({ achievements: data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
