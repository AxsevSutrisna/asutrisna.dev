import { useEffect } from "react"
import { useCoursesStore } from "../../../store/useCoursesStore"

export function useCourses() {
  const { courses, loading, fetchCourses } = useCoursesStore()

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return { courses, loading }
}
