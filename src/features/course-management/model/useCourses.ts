import { useCallback, useEffect, useState } from "react"
import {
  courseRepository,
  type CourseInput,
} from "@/entities/course/api/courseRepository"
import type { Course } from "@/entities/course/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/** Use-case hook pengelolaan Courses di dashboard admin. */
export function useCourseManagement(notify?: Notify) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setCourses(await courseRepository.list())
    } catch (err) {
      notify?.("error", message(err, "Failed to fetch courses."))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createCourse = useCallback(
    async (input: CourseInput, file?: File | null) => {
      setUploading(true)
      try {
        await courseRepository.create(input, file)
        notify?.("success", "Course added successfully!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Failed to create course."))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh]
  )

  const updateCourse = useCallback(
    async (
      id: number | string,
      input: CourseInput,
      file: File | null | undefined,
      currentImgUrl: string | null | undefined
    ) => {
      setUploading(true)
      try {
        await courseRepository.update(id, input, file, currentImgUrl)
        notify?.("success", "Course updated successfully!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Failed to update course."))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh]
  )

  const removeCourse = useCallback(
    async (id: number | string) => {
      try {
        await courseRepository.remove(id)
        notify?.("success", "Course deleted successfully!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Failed to delete course."))
      }
    },
    [notify, refresh]
  )

  return {
    courses,
    loading,
    uploading,
    createCourse,
    updateCourse,
    removeCourse,
  }
}
