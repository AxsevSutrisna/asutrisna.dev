import { useCallback, useEffect, useState } from "react"
import { techStackRepository } from "@/entities/techStack/api/techStackRepository"
import type { TechStack } from "@/entities/techStack/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

interface TechStackFormValues {
  name: string
  slug: string
  category: string
  description: string
  sort_order: number | string
  is_active: boolean
  icon_url: string
}

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/** Use-case hook pengelolaan Tech Stacks di dashboard admin. */
export function useTechStackManagement(notify?: Notify) {
  const [items, setItems] = useState<TechStack[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await techStackRepository.list())
    } catch (err) {
      notify?.("error", message(err, "Failed to load tech stacks"))
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
        (highest, item) => Math.max(highest, Number(item.sort_order || 0)),
        0
      ) + 1,
    [items]
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

  const save = useCallback(
    async (
      form: TechStackFormValues,
      iconFile: File | null,
      id?: number | string
    ) => {
      setUploading(true)
      try {
        const slug = await techStackRepository.ensureUniqueSlug(
          form.slug || form.name,
          id ?? null
        )
        const iconUrl = iconFile
          ? await techStackRepository.uploadIcon(iconFile)
          : form.icon_url

        const input = {
          name: form.name,
          slug,
          category: form.category || null,
          description: form.description || null,
          icon_url: iconUrl,
          sort_order: resolveSortOrder(form.sort_order),
          is_active: form.is_active,
        }

        if (id == null) {
          await techStackRepository.create(input)
          notify?.("success", "Tech stack created successfully!")
        } else {
          await techStackRepository.update(id, input)
          notify?.("success", "Tech stack updated successfully!")
        }
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Failed to save tech stack"))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh, resolveSortOrder]
  )

  const createItem = useCallback(
    (form: TechStackFormValues, iconFile: File | null) => save(form, iconFile),
    [save]
  )

  const updateItem = useCallback(
    (id: number | string, form: TechStackFormValues, iconFile: File | null) =>
      save(form, iconFile, id),
    [save]
  )

  const removeItem = useCallback(
    async (id: number | string) => {
      try {
        await techStackRepository.remove(id)
        notify?.("success", "Tech stack deleted successfully!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Failed to delete tech stack"))
      }
    },
    [notify, refresh]
  )

  const toggleActive = useCallback(
    async (item: TechStack) => {
      try {
        await techStackRepository.setActive(item.id, !item.is_active)
        notify?.("success", "Tech stack status updated!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Failed to update status"))
      }
    },
    [notify, refresh]
  )

  const reorderItems = useCallback(
    async (ordered: TechStack[]) => {
      setItems(ordered) // optimistic
      try {
        await techStackRepository.reorder(ordered.map((item) => item.id))
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Failed to reorder tech stacks"))
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
    reorderItems,
  }
}
