import { educationRepository } from "@/entities/education/api/educationRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import {
  normalizeEducation,
  compareEducationTimeline,
} from "@/utils/educations"
import type {
  Education,
  EducationInput,
} from "@/entities/education/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

/** Use-case hook pengelolaan Educations di dashboard admin. */
export function useEducationManagement(notify?: Notify) {
  const { items, loading, busy, run } = useCrudResource<Education>(
    educationRepository.fetchAll,
    notify,
    {
      loadError: "Gagal memuat educations",
      map: (rows) => rows.map(normalizeEducation).sort(compareEducationTimeline),
    }
  )

  const createEducation = (payload: EducationInput) =>
    run(() => educationRepository.create(payload), {
      success: "Education saved!",
      error: "Gagal menyimpan education",
    })

  const updateEducation = (id: number | string, payload: EducationInput) =>
    run(() => educationRepository.update(id, payload), {
      success: "Education updated!",
      error: "Gagal memperbarui education",
    })

  const removeEducation = (id: number | string) =>
    run(() => educationRepository.remove(id), {
      success: "Education deleted.",
      error: "Gagal menghapus education",
    })

  return {
    educations: items,
    loading,
    submitting: busy,
    createEducation,
    updateEducation,
    removeEducation,
  }
}
