import { techStackRepository } from "@/entities/techStack/api/techStackRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import { resolveSortOrder } from "@/shared/lib/sortOrder"
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

/** Use-case hook pengelolaan Tech Stacks di dashboard admin. */
export function useTechStackManagement(notify?: Notify) {
  const { items, setItems, loading, busy, run } = useCrudResource<TechStack>(
    techStackRepository.list,
    notify,
    { loadError: "Failed to load tech stacks" }
  )

  const persist = (
    form: TechStackFormValues,
    iconFile: File | null,
    id?: number | string
  ) =>
    run(
      async () => {
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
          sort_order: resolveSortOrder(items, form.sort_order),
          is_active: form.is_active,
        }
        if (id == null) await techStackRepository.create(input)
        else await techStackRepository.update(id, input)
      },
      {
        success:
          id == null
            ? "Tech stack created successfully!"
            : "Tech stack updated successfully!",
        error: "Failed to save tech stack",
      }
    )

  const createItem = (form: TechStackFormValues, iconFile: File | null) =>
    persist(form, iconFile)

  const updateItem = (
    id: number | string,
    form: TechStackFormValues,
    iconFile: File | null
  ) => persist(form, iconFile, id)

  const removeItem = (id: number | string) =>
    run(() => techStackRepository.remove(id), {
      success: "Tech stack deleted successfully!",
      error: "Failed to delete tech stack",
    })

  const toggleActive = (item: TechStack) =>
    run(() => techStackRepository.setActive(item.id, !item.is_active), {
      success: "Tech stack status updated!",
      error: "Failed to update status",
    })

  const reorderItems = async (ordered: TechStack[]) => {
    setItems(ordered) // optimistic
    await run(() => techStackRepository.reorder(ordered.map((i) => i.id)), {
      error: "Failed to reorder tech stacks",
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
    reorderItems,
  }
}
