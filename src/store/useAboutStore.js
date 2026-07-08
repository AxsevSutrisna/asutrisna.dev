import { create } from "zustand"
import { aboutService } from "../services/aboutService"
import { experienceService } from "../services/experienceService"

export const useAboutStore = create((set, get) => ({
  content: null,
  workItems: [],
  loading: false,
  error: null,

  fetchAboutData: async () => {
    if (get().content && get().workItems.length > 0) return

    set({ loading: true, error: null })
    try {
      const [contentData, workData] = await Promise.all([
        aboutService.fetchAboutContent(),
        experienceService.fetchWorkExperiences(),
      ])
      set({ content: contentData, workItems: workData, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
