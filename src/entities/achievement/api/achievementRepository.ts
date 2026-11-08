import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import type {
  Achievement,
  AchievementInput,
} from "@/entities/achievement/model/types"

async function fetchAll(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) throw wrapError(error, "Gagal memuat achievements")
  return (data ?? []) as Achievement[]
}

async function create(input: AchievementInput): Promise<void> {
  const { error } = await supabase.from("achievements").insert([input])
  if (error) throw wrapError(error, "Gagal membuat achievement")
}

async function update(
  id: number | string,
  input: AchievementInput
): Promise<void> {
  const { error } = await supabase
    .from("achievements")
    .update(input)
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui achievement")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("achievements").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus achievement")
}

/** Simpan urutan: update `sort_order` tertarget per-id (1-based). */
async function reorder(orderedIds: Array<number | string>): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("achievements")
        .update({ sort_order: index + 1 })
        .eq("id", id)
    )
  )
  const failed = results.find((result) => result.error)
  if (failed?.error) {
    throw wrapError(failed.error, "Gagal menyimpan urutan achievement")
  }
}

export const achievementRepository = {
  fetchAll,
  create,
  update,
  remove,
  reorder,
}
