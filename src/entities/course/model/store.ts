import { create } from "zustand"
import { courseRepository } from "@/entities/course/api/courseRepository"
import type { Course } from "@/entities/course/model/types"

interface CourseState {
  courses: Course[]
  loading: boolean
  error: string | null
  fetchCourses: (force?: boolean) => Promise<void>
}

export const useCoursesStore = create<CourseState>((set, get) => ({
  courses: [],
  loading: false,
  error: null,

  fetchCourses: async (force = false) => {
    if (!force && get().courses.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await courseRepository.fetchAll()
      set({ courses: data, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      })
    }
  },
}))
