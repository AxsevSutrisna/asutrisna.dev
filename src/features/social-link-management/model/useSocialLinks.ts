import { useCallback, useEffect, useState } from "react"
import { socialLinkRepository } from "@/entities/socialLink/api/socialLinkRepository"
import type { SocialLink } from "@/entities/socialLink/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

interface SocialLinkFormValues {
  platform: string
  display_name: string
  sub_text: string
  url: string
  icon: string
  color: string
  gradient: string
  sort_order: number | string
  is_primary: boolean
  is_active: boolean
}

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

const normalizeUrl = (value: string): string => {
  try {
    return new URL(value).toString()
  } catch {
    return value
  }
}

/** Use-case hook pengelolaan Social Links di dashboard admin. */
export function useSocialLinkManagement(notify?: Notify) {
  const [items, setItems] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await socialLinkRepository.list())
    } catch (err) {
      notify?.("error", message(err, "Gagal memuat social links"))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const nextSortOrder = useCallback(
    () =>
      items.reduce(
        (max, item) => Math.max(max, Number(item.sort_order || 0)),
        0
      ) + 1,
    [items]
  )

  const resolveSortOrder = useCallback(
    (value: number | string): number => {
      if (value === "" || value === null || value === undefined) {
        return nextSortOrder()
      }
      return Math.max(0, Number(value) || 0)
    },
    [nextSortOrder]
  )

  const save = useCallback(
    async (
      form: SocialLinkFormValues,
      iconFile: File | null,
      id?: number | string
    ) => {
      setUploading(true)
      try {
        let iconValue: string | null = form.icon?.trim() || null
        if (iconFile) iconValue = await socialLinkRepository.uploadIcon(iconFile)

        const input = {
          platform: form.platform.trim(),
          display_name: form.display_name.trim(),
          sub_text: form.sub_text.trim(),
          url: normalizeUrl(form.url.trim()),
          icon: iconValue,
          color: form.color.trim(),
          gradient: form.gradient.trim(),
          sort_order: resolveSortOrder(form.sort_order),
          is_primary: form.is_primary,
          is_active: form.is_active,
        }

        if (id == null) {
          await socialLinkRepository.create(input)
          notify?.("success", "Created!")
        } else {
          await socialLinkRepository.update(id, input)
          notify?.("success", "Updated!")
        }
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal menyimpan social link"))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh, resolveSortOrder]
  )

  const createItem = useCallback(
    (form: SocialLinkFormValues, iconFile: File | null) => save(form, iconFile),
    [save]
  )

  const updateItem = useCallback(
    (id: number | string, form: SocialLinkFormValues, iconFile: File | null) =>
      save(form, iconFile, id),
    [save]
  )

  const removeItem = useCallback(
    async (id: number | string) => {
      try {
        await socialLinkRepository.remove(id)
        notify?.("success", "Deleted!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal menghapus social link"))
      }
    },
    [notify, refresh]
  )

  const toggleActive = useCallback(
    async (item: SocialLink) => {
      try {
        await socialLinkRepository.setActive(item.id, !item.is_active)
        notify?.("success", "Status updated!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal memperbarui status"))
      }
    },
    [notify, refresh]
  )

  const setPrimary = useCallback(
    async (item: SocialLink) => {
      try {
        await socialLinkRepository.setPrimary(item.id)
        notify?.("success", "Primary link updated!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal menetapkan primary link"))
      }
    },
    [notify, refresh]
  )

  const reorderItems = useCallback(
    async (ordered: SocialLink[]) => {
      setItems(ordered) // optimistic
      try {
        await socialLinkRepository.reorder(ordered.map((item) => item.id))
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal mengurutkan social link"))
        await refresh()
      }
    },
    [notify, refresh]
  )

  return {
    items,
    loading,
    uploading,
    createItem,
    updateItem,
    removeItem,
    toggleActive,
    setPrimary,
    reorderItems,
  }
}
