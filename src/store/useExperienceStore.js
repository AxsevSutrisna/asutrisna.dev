import { create } from "zustand"
import { experienceService } from "../services/experienceService"

export const useExperienceStore = create((set, get) => ({
  workExperiences: [],
  educations: [],
  loading: false,
  error: null,

  fetchExperienceData: async () => {
    if (get().workExperiences.length > 0 || get().educations.length > 0) return

    set({ loading: true, error: null })
    try {
      const [workData, eduData] = await Promise.all([
        experienceService.fetchWorkExperiences(),
        experienceService.fetchEducations(),
      ])
      set({ workExperiences: workData, educations: eduData, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
