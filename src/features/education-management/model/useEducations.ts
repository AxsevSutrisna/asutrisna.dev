import { useCallback, useEffect, useState } from "react"
import { educationRepository } from "@/entities/education/api/educationRepository"
import type {
  Education,
  EducationInput,
} from "@/entities/education/model/types"
import {
  normalizeEducation,
  compareEducationTimeline,
} from "@/utils/educations"

type Notify = (type: "success" | "error" | "info", message: string) => void

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/** Use-case hook pengelolaan Educations di dashboard admin. */
export function useEducationManagement(notify?: Notify) {
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await educationRepository.fetchAll()
      setEducations(
        data.map(normalizeEducation).sort(compareEducationTimeline)
      )
    } catch (err) {
      notify?.("error", message(err, "Gagal memuat educations"))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createEducation = useCallback(
    async (payload: EducationInput) => {
      setSubmitting(true)
      try {
        await educationRepository.create(payload)
        notify?.("success", "Education saved!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal menyimpan education"))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [notify, refresh]
  )

  const updateEducation = useCallback(
    async (id: number | string, payload: EducationInput) => {
      setSubmitting(true)
      try {
        await educationRepository.update(id, payload)
        notify?.("success", "Education updated!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal memperbarui education"))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [notify, refresh]
  )

  const removeEducation = useCallback(
    async (id: number | string) => {
      try {
        await educationRepository.remove(id)
        notify?.("success", "Education deleted.")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal menghapus education"))
      }
    },
    [notify, refresh]
  )

  return {
    educations,
    loading,
    submitting,
    createEducation,
    updateEducation,
    removeEducation,
  }
}
