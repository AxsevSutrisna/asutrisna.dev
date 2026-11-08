import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import type {
  WorkExperience,
  WorkExperienceInput,
} from "@/entities/experience/model/types"

/** Baris mentah (normalisasi/sort dilakukan konsumen via utils/workExperiences). */
async function fetchAll(): Promise<WorkExperience[]> {
  const { data, error } = await supabase.from("work_experiences").select("*")
  if (error) throw wrapError(error, "Gagal memuat work experiences")
  return (data ?? []) as WorkExperience[]
}

async function create(payload: WorkExperienceInput): Promise<void> {
  const { error } = await supabase.from("work_experiences").insert([payload])
  if (error) throw wrapError(error, "Gagal membuat work experience")
}

async function update(
  id: number | string,
  payload: WorkExperienceInput
): Promise<void> {
  const { error } = await supabase
    .from("work_experiences")
    .update(payload)
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui work experience")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase
    .from("work_experiences")
    .delete()
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus work experience")
}

export const experienceRepository = { fetchAll, create, update, remove }
