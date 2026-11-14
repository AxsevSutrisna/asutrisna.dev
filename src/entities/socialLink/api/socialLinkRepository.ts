import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import { uploadFile, sanitizeFileName } from "@/shared/api/storage"
import type {
  SocialLink,
  SocialLinkInput,
} from "@/entities/socialLink/model/types"

// Catatan: ikon social memakai bucket "project-images" dengan prefix path
// "social-icons/" (skema lama dipertahankan agar URL existing tetap valid).
const SOCIAL_ICON_BUCKET = "project-images"

/** Hanya yang aktif (website publik). */
async function fetchActive(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) throw wrapError(error, "Gagal memuat social links")
  return (data ?? []) as SocialLink[]
}

/** Semua baris (dashboard admin). */
async function list(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) throw wrapError(error, "Gagal memuat social links")
  return (data ?? []) as SocialLink[]
}

async function uploadIcon(file: File): Promise<string> {
  const path = `social-icons/${Date.now()}-${sanitizeFileName(file.name)}`
  return uploadFile(SOCIAL_ICON_BUCKET, file, { path, upsert: true })
}

/** Set semua is_primary=false (kecuali excludeId) agar primary tunggal. */
async function clearOtherPrimary(
  excludeId?: number | string | null
): Promise<void> {
  let query = supabase
    .from("social_links")
    .update({ is_primary: false })
    .eq("is_primary", true)
  if (excludeId != null) query = query.neq("id", excludeId)

  const { error } = await query
  if (error) throw wrapError(error, "Gagal memperbarui primary link")
}

async function create(input: SocialLinkInput): Promise<void> {
  if (input.is_primary) await clearOtherPrimary()
  const { error } = await supabase.from("social_links").insert(input)
  if (error) throw wrapError(error, "Gagal membuat social link")
}

async function update(
  id: number | string,
  input: SocialLinkInput
): Promise<void> {
  if (input.is_primary) await clearOtherPrimary(id)
  const { error } = await supabase
    .from("social_links")
    .update(input)
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui social link")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("social_links").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus social link")
}

async function setActive(
  id: number | string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from("social_links")
    .update({ is_active: isActive })
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui status")
}

async function setPrimary(id: number | string): Promise<void> {
  await clearOtherPrimary(id)
  const { error } = await supabase
    .from("social_links")
    .update({ is_primary: true })
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal menetapkan primary link")
}

async function reorder(orderedIds: Array<number | string>): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("social_links")
        .update({ sort_order: index + 1 })
        .eq("id", id)
    )
  )
  const failed = results.find((result) => result.error)
  if (failed?.error) {
    throw wrapError(failed.error, "Gagal menyimpan urutan social link")
  }
}

export const socialLinkRepository = {
  fetchActive,
  list,
  uploadIcon,
  create,
  update,
  remove,
  setActive,
  setPrimary,
  reorder,
}
