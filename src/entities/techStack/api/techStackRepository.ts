import { supabase } from "@/shared/api/supabaseClient"
import { wrapError, AppError } from "@/shared/api/errors"
import { uploadFile, sanitizeFileName } from "@/shared/api/storage"
import { techStackSlug } from "@/entities/techStack/lib/techStackSlug"
import type { TechStack, TechStackInput } from "@/entities/techStack/model/types"

const TECH_ICON_BUCKET = "tech-stack-icons"

/** Hanya yang aktif (untuk website publik). */
async function fetchActive(): Promise<TechStack[]> {
  const { data, error } = await supabase
    .from("tech_stacks")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw wrapError(error, "Gagal memuat tech stacks")
  return (data ?? []) as TechStack[]
}

/** Semua baris (untuk dashboard admin). */
async function list(): Promise<TechStack[]> {
  const { data, error } = await supabase
    .from("tech_stacks")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw wrapError(error, "Gagal memuat tech stacks")
  return (data ?? []) as TechStack[]
}

async function uploadIcon(file: File): Promise<string> {
  const path = `tech-${Date.now()}-${sanitizeFileName(file.name)}`
  return uploadFile(TECH_ICON_BUCKET, file, { path, upsert: true })
}

/** Normalisasi slug + pastikan unik. Throw bila kosong / sudah dipakai. */
async function ensureUniqueSlug(
  rawSlug: string,
  excludeId?: number | string | null
): Promise<string> {
  const slug = techStackSlug(rawSlug)
  if (!slug) throw new AppError("Slug is required")

  let query = supabase.from("tech_stacks").select("id").eq("slug", slug)
  if (excludeId != null) query = query.neq("id", excludeId)

  const { data, error } = await query.limit(1)
  if (error) throw wrapError(error, "Gagal memeriksa slug")
  if ((data ?? []).length > 0) {
    throw new AppError("Slug already used. Please choose another one.")
  }
  return slug
}

async function create(input: TechStackInput): Promise<void> {
  const { error } = await supabase.from("tech_stacks").insert(input)
  if (error) throw wrapError(error, "Gagal membuat tech stack")
}

async function update(
  id: number | string,
  input: TechStackInput
): Promise<void> {
  const { error } = await supabase
    .from("tech_stacks")
    .update(input)
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui tech stack")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("tech_stacks").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus tech stack")
}

async function setActive(
  id: number | string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from("tech_stacks")
    .update({ is_active: isActive })
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui status")
}

async function reorder(orderedIds: Array<number | string>): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("tech_stacks")
        .update({ sort_order: index + 1 })
        .eq("id", id)
    )
  )
  const failed = results.find((result) => result.error)
  if (failed?.error) {
    throw wrapError(failed.error, "Gagal menyimpan urutan tech stack")
  }
}

export const techStackRepository = {
  fetchActive,
  list,
  uploadIcon,
  ensureUniqueSlug,
  create,
  update,
  remove,
  setActive,
  reorder,
}
