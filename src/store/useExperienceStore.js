import { create } from "zustand"
import { experienceRepository } from "@/entities/experience/api/experienceRepository"
import { educationRepository } from "@/entities/education/api/educationRepository"

/**
 * Store publik gabungan (work experiences + educations) karena keduanya diambil
 * bersamaan oleh useExperienceData. Mengkomposisi dua repository entity.
 */
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
        experienceRepository.fetchAll(),
        educationRepository.fetchAll(),
      ])
      set({ workExperiences: workData, educations: eduData, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      })
    }
  },
}))
