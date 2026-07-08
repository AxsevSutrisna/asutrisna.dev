import { create } from "zustand"
import { courseService } from "../services/courseService"

export const useCoursesStore = create((set, get) => ({
  courses: [],
  loading: false,
  error: null,

  fetchCourses: async () => {
    if (get().courses.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await courseService.fetchAll()
      set({ courses: data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))
