import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import type { Education, EducationInput } from "@/entities/education/model/types"

async function fetchAll(): Promise<Education[]> {
  const { data, error } = await supabase.from("educations").select("*")
  if (error) throw wrapError(error, "Gagal memuat educations")
  return (data ?? []) as Education[]
}

async function create(payload: EducationInput): Promise<void> {
  const { error } = await supabase.from("educations").insert([payload])
  if (error) throw wrapError(error, "Gagal membuat education")
}

async function update(
  id: number | string,
  payload: EducationInput
): Promise<void> {
  const { error } = await supabase.from("educations").update(payload).eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui education")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("educations").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus education")
}

export const educationRepository = { fetchAll, create, update, remove }
