import { socialLinkRepository } from "@/entities/socialLink/api/socialLinkRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import { resolveSortOrder } from "@/shared/lib/sortOrder"
import type { SocialLink } from "@/entities/socialLink/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

interface SocialLinkFormValues {
  platform: string
  display_name: string
  sub_text: string
  url: string
  icon: string
  color: string
  sort_order: number | string
  is_primary: boolean
  is_active: boolean
}

const normalizeUrl = (value: string): string => {
  try {
    return new URL(value).toString()
  } catch {
    return value
  }
}

/** Use-case hook pengelolaan Social Links di dashboard admin. */
export function useSocialLinkManagement(notify?: Notify) {
  const { items, setItems, loading, busy, run } = useCrudResource<SocialLink>(
    socialLinkRepository.list,
    notify,
    { loadError: "Gagal memuat social links" }
  )

  const persist = (
    form: SocialLinkFormValues,
    iconFile: File | null,
    id?: number | string
  ) =>
    run(
      async () => {
        let iconValue: string | null = form.icon?.trim() || null
        if (iconFile) iconValue = await socialLinkRepository.uploadIcon(iconFile)
        const input = {
          platform: form.platform.trim(),
          display_name: form.display_name.trim(),
          sub_text: form.sub_text.trim(),
          url: normalizeUrl(form.url.trim()),
          icon: iconValue,
          color: form.color.trim(),
          sort_order: resolveSortOrder(items, form.sort_order),
          is_primary: form.is_primary,
          is_active: form.is_active,
        }
        if (id == null) await socialLinkRepository.create(input)
        else await socialLinkRepository.update(id, input)
      },
      {
        success: id == null ? "Created!" : "Updated!",
        error: "Gagal menyimpan social link",
      }
    )

  const createItem = (form: SocialLinkFormValues, iconFile: File | null) =>
    persist(form, iconFile)

  const updateItem = (
    id: number | string,
    form: SocialLinkFormValues,
    iconFile: File | null
  ) => persist(form, iconFile, id)

  const removeItem = (id: number | string) =>
    run(() => socialLinkRepository.remove(id), {
      success: "Deleted!",
      error: "Gagal menghapus social link",
    })

  const toggleActive = (item: SocialLink) =>
    run(() => socialLinkRepository.setActive(item.id, !item.is_active), {
      success: "Status updated!",
      error: "Gagal memperbarui status",
    })

  const setPrimary = (item: SocialLink) =>
    run(() => socialLinkRepository.setPrimary(item.id), {
      success: "Primary link updated!",
      error: "Gagal menetapkan primary link",
    })

  const reorderItems = async (ordered: SocialLink[]) => {
    setItems(ordered) // optimistic
    await run(() => socialLinkRepository.reorder(ordered.map((i) => i.id)), {
      error: "Gagal mengurutkan social link",
    })
  }

  return {
    items,
    loading,
    uploading: busy,
    createItem,
    updateItem,
    removeItem,
    toggleActive,
    setPrimary,
    reorderItems,
  }
}
