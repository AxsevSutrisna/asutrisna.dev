import { useCallback, useEffect, useState } from "react"
import { achievementRepository } from "@/entities/achievement/api/achievementRepository"
import type {
  Achievement,
  AchievementInput,
} from "@/entities/achievement/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void
type FormValues = Omit<AchievementInput, "sort_order"> & {
  sort_order: number | string
}

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/** Use-case hook pengelolaan Achievements di dashboard admin. */
export function useAchievementManagement(notify?: Notify) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setAchievements(await achievementRepository.fetchAll())
    } catch (err) {
      notify?.("error", message(err, "Gagal memuat achievements"))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const nextSortOrder = useCallback(
    () =>
      achievements.reduce(
        (highest, item) => Math.max(highest, Number(item.sort_order || 0)),
        0
      ) + 1,
    [achievements]
  )

  const resolveSortOrder = useCallback(
    (value: number | string): number => {
      if (value === "" || value === null || value === undefined) {
        return nextSortOrder()
      }
      const parsed = Number(value)
      return Number.isNaN(parsed) ? nextSortOrder() : parsed
    },
    [nextSortOrder]
  )

  const toInput = useCallback(
    (form: FormValues): AchievementInput => ({
      title: form.title,
      deskripsi: form.deskripsi,
      place: form.place,
      badge_text: form.badge_text,
      date: form.date,
      level_competition: form.level_competition,
      sort_order: resolveSortOrder(form.sort_order),
    }),
    [resolveSortOrder]
  )

  const createAchievement = useCallback(
    async (form: FormValues) => {
      setSaving(true)
      try {
        await achievementRepository.create(toInput(form))
        notify?.("success", "Achievement created!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal membuat achievement"))
        return false
      } finally {
        setSaving(false)
      }
    },
    [notify, refresh, toInput]
  )

  const updateAchievement = useCallback(
    async (id: number | string, form: FormValues) => {
      setSaving(true)
      try {
        await achievementRepository.update(id, toInput(form))
        notify?.("success", "Achievement updated!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal memperbarui achievement"))
        return false
      } finally {
        setSaving(false)
      }
    },
    [notify, refresh, toInput]
  )

  const removeAchievement = useCallback(
    async (id: number | string) => {
      try {
        await achievementRepository.remove(id)
        notify?.("success", "Achievement removed.")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal menghapus achievement"))
      }
    },
    [notify, refresh]
  )

  const reorderAchievements = useCallback(
    async (ordered: Achievement[]) => {
      setAchievements(ordered) // optimistic
      try {
        await achievementRepository.reorder(ordered.map((item) => item.id))
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal menyimpan urutan achievement"))
        await refresh()
      }
    },
    [notify, refresh]
  )

  return {
    achievements,
    loading,
    saving,
    createAchievement,
    updateAchievement,
    removeAchievement,
    reorderAchievements,
  }
}
