import { useCallback, useEffect, useState } from "react"
import { experienceRepository } from "@/entities/experience/api/experienceRepository"
import type {
  WorkExperience,
  WorkExperienceInput,
} from "@/entities/experience/model/types"
import {
  normalizeWorkExperience,
  compareWorkExperienceTimeline,
} from "@/utils/workExperiences"

type Notify = (type: "success" | "error" | "info", message: string) => void

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/** Use-case hook pengelolaan Work Experience di dashboard admin. */
export function useWorkExperienceManagement(notify?: Notify) {
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await experienceRepository.fetchAll()
      setExperiences(
        data.map(normalizeWorkExperience).sort(compareWorkExperienceTimeline)
      )
    } catch (err) {
      notify?.("error", message(err, "Gagal memuat work experiences"))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createExperience = useCallback(
    async (payload: WorkExperienceInput) => {
      setSubmitting(true)
      try {
        await experienceRepository.create(payload)
        notify?.("success", "Experience saved!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal menyimpan experience"))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [notify, refresh]
  )

  const updateExperience = useCallback(
    async (id: number | string, payload: WorkExperienceInput) => {
      setSubmitting(true)
      try {
        await experienceRepository.update(id, payload)
        notify?.("success", "Experience updated!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal memperbarui experience"))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [notify, refresh]
  )

  const removeExperience = useCallback(
    async (id: number | string) => {
      try {
        await experienceRepository.remove(id)
        notify?.("success", "Experience deleted.")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal menghapus experience"))
      }
    },
    [notify, refresh]
  )

  return {
    experiences,
    loading,
    submitting,
    createExperience,
    updateExperience,
    removeExperience,
  }
}
