import { experienceRepository } from "@/entities/experience/api/experienceRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import {
  normalizeWorkExperience,
  compareWorkExperienceTimeline,
} from "@/utils/workExperiences"
import type {
  WorkExperience,
  WorkExperienceInput,
} from "@/entities/experience/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

/** Use-case hook pengelolaan Work Experience di dashboard admin. */
export function useWorkExperienceManagement(notify?: Notify) {
  const { items, loading, busy, run } = useCrudResource<WorkExperience>(
    experienceRepository.fetchAll,
    notify,
    {
      loadError: "Gagal memuat work experiences",
      map: (rows) =>
        rows.map(normalizeWorkExperience).sort(compareWorkExperienceTimeline),
    }
  )

  const createExperience = (payload: WorkExperienceInput) =>
    run(() => experienceRepository.create(payload), {
      success: "Experience saved!",
      error: "Gagal menyimpan experience",
    })

  const updateExperience = (id: number | string, payload: WorkExperienceInput) =>
    run(() => experienceRepository.update(id, payload), {
      success: "Experience updated!",
      error: "Gagal memperbarui experience",
    })

  const removeExperience = (id: number | string) =>
    run(() => experienceRepository.remove(id), {
      success: "Experience deleted.",
      error: "Gagal menghapus experience",
    })

  return {
    experiences: items,
    loading,
    submitting: busy,
    createExperience,
    updateExperience,
    removeExperience,
  }
}
