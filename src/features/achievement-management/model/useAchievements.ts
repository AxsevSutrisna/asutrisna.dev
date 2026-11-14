import { achievementRepository } from "@/entities/achievement/api/achievementRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import { resolveSortOrder } from "@/shared/lib/sortOrder"
import type {
  Achievement,
  AchievementInput,
} from "@/entities/achievement/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void
type FormValues = Omit<AchievementInput, "sort_order"> & {
  sort_order: number | string
}

/** Use-case hook pengelolaan Achievements di dashboard admin. */
export function useAchievementManagement(notify?: Notify) {
  const { items, setItems, loading, busy, run } = useCrudResource<Achievement>(
    achievementRepository.fetchAll,
    notify,
    { loadError: "Gagal memuat achievements" }
  )

  const toInput = (form: FormValues): AchievementInput => ({
    title: form.title,
    deskripsi: form.deskripsi,
    place: form.place,
    badge_text: form.badge_text,
    date: form.date,
    level_competition: form.level_competition,
    sort_order: resolveSortOrder(items, form.sort_order),
  })

  const createAchievement = (form: FormValues) =>
    run(() => achievementRepository.create(toInput(form)), {
      success: "Achievement created!",
      error: "Gagal membuat achievement",
    })

  const updateAchievement = (id: number | string, form: FormValues) =>
    run(() => achievementRepository.update(id, toInput(form)), {
      success: "Achievement updated!",
      error: "Gagal memperbarui achievement",
    })

  const removeAchievement = (id: number | string) =>
    run(() => achievementRepository.remove(id), {
      success: "Achievement removed.",
      error: "Gagal menghapus achievement",
    })

  const reorderAchievements = async (ordered: Achievement[]) => {
    setItems(ordered) // optimistic
    await run(() => achievementRepository.reorder(ordered.map((i) => i.id)), {
      error: "Gagal menyimpan urutan achievement",
    })
  }

  return {
    achievements: items,
    loading,
    saving: busy,
    createAchievement,
    updateAchievement,
    removeAchievement,
    reorderAchievements,
  }
}
