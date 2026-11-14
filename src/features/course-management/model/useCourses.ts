import {
  courseRepository,
  type CourseInput,
} from "@/entities/course/api/courseRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import type { Course } from "@/entities/course/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

/** Use-case hook pengelolaan Courses di dashboard admin. */
export function useCourseManagement(notify?: Notify) {
  const { items, loading, busy, run } = useCrudResource<Course>(
    courseRepository.list,
    notify,
    { loadError: "Failed to fetch courses." }
  )

  const createCourse = (input: CourseInput, file?: File | null) =>
    run(() => courseRepository.create(input, file), {
      success: "Course added successfully!",
      error: "Failed to create course.",
    })

  const updateCourse = (
    id: number | string,
    input: CourseInput,
    file: File | null | undefined,
    currentImgUrl: string | null | undefined
  ) =>
    run(() => courseRepository.update(id, input, file, currentImgUrl), {
      success: "Course updated successfully!",
      error: "Failed to update course.",
    })

  const removeCourse = (id: number | string) =>
    run(() => courseRepository.remove(id), {
      success: "Course deleted successfully!",
      error: "Failed to delete course.",
    })

  return {
    courses: items,
    loading,
    uploading: busy,
    createCourse,
    updateCourse,
    removeCourse,
  }
}
