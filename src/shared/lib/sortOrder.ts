type HasSortOrder = { sort_order?: number | null }

/** `sort_order` berikutnya = (max yang ada) + 1. */
export const nextSortOrder = (items: HasSortOrder[]): number =>
  items.reduce((max, item) => Math.max(max, Number(item.sort_order || 0)), 0) + 1

/**
 * Resolusi nilai `sort_order` dari input form.
 * Kosong / tidak valid → auto di bawah; selain itu angka (minimal 0).
 */
export const resolveSortOrder = (
  items: HasSortOrder[],
  value: number | string
): number => {
  if (value === "" || value === null || value === undefined) {
    return nextSortOrder(items)
  }
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return nextSortOrder(items)
  return Math.max(0, parsed)
}
