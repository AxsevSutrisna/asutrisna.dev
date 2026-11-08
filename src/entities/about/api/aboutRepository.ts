import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import { uploadFile, sanitizeFileName } from "@/shared/api/storage"
import type {
  AboutContent,
  AboutContentInput,
} from "@/entities/about/model/types"

const PHOTO_BUCKET = "about-images"
const CV_BUCKET = "about-cv"

/** Konten about yang sedang live (versi terbaru yang published) — publik. */
async function fetchPublished(): Promise<AboutContent | null> {
  const { data, error } = await supabase
    .from("about_contents")
    .select("*")
    .eq("is_published", true)
    .order("version", { ascending: false })
    .limit(1)

  if (error) throw wrapError(error, "Gagal memuat konten about")
  return (data?.[0] as AboutContent | undefined) ?? null
}

/** Semua versi (dashboard admin). */
async function list(): Promise<AboutContent[]> {
  const { data, error } = await supabase
    .from("about_contents")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw wrapError(error, "Gagal memuat konten about")
  return (data ?? []) as AboutContent[]
}

async function uploadPhoto(file: File): Promise<string> {
  const path = `about-photo-${Date.now()}-${sanitizeFileName(file.name)}`
  return uploadFile(PHOTO_BUCKET, file, { path, upsert: true })
}

async function uploadCv(file: File): Promise<string> {
  const path = `about-cv-${Date.now()}-${sanitizeFileName(file.name)}`
  return uploadFile(CV_BUCKET, file, { path, upsert: true })
}

/** Jadikan semua lain unpublished agar hanya satu yang live. */
async function unpublishOthers(excludeId?: number | string | null): Promise<void> {
  let query = supabase
    .from("about_contents")
    .update({ is_published: false })
    .eq("is_published", true)
  if (excludeId != null) query = query.neq("id", excludeId)

  const { error } = await query
  if (error) throw wrapError(error, "Gagal memperbarui status publish")
}

async function create(input: AboutContentInput): Promise<void> {
  if (input.is_published) await unpublishOthers()
  const { error } = await supabase.from("about_contents").insert(input)
  if (error) throw wrapError(error, "Gagal menyimpan konten about")
}

async function update(
  id: number | string,
  input: AboutContentInput
): Promise<void> {
  if (input.is_published) await unpublishOthers(id)
  const { error } = await supabase
    .from("about_contents")
    .update(input)
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui konten about")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("about_contents").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus konten about")
}

async function publish(id: number | string): Promise<void> {
  await unpublishOthers(id)
  const { error } = await supabase
    .from("about_contents")
    .update({ is_published: true })
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal mempublish konten about")
}

async function unpublish(id: number | string): Promise<void> {
  const { error } = await supabase
    .from("about_contents")
    .update({ is_published: false })
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal unpublish konten about")
}

/** Signed URL untuk melihat CV (bucket privat), 1 jam. Null bila gagal. */
async function getCvSignedUrl(cvUrl: string): Promise<string | null> {
  let path = cvUrl
  if (cvUrl.includes("/about-cv/")) {
    path = cvUrl.split("/about-cv/").slice(1).join("/about-cv/")
  }
  path = decodeURIComponent(path)

  const { data, error } = await supabase.storage
    .from(CV_BUCKET)
    .createSignedUrl(path, 3600)
  if (error) return null
  return data?.signedUrl ?? null
}

export const aboutRepository = {
  fetchPublished,
  list,
  uploadPhoto,
  uploadCv,
  create,
  update,
  remove,
  publish,
  unpublish,
  getCvSignedUrl,
}
