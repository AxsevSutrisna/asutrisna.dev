import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import { uploadFile, sanitizeFileName } from "@/shared/api/storage"
import { subscribe as subscribeTable } from "@/shared/api/realtime"
import type {
  HeroContent,
  HeroContentInput,
} from "@/entities/heroContent/model/types"

const HERO_BUCKET = "project-images"

/** Hero aktif untuk website publik. */
async function fetchActive(): Promise<HeroContent | null> {
  const { data, error } = await supabase
    .from("hero_contents")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle()

  if (error) throw wrapError(error, "Gagal memuat hero content")
  return (data as HeroContent | null) ?? null
}

/** Hero tunggal (dashboard admin — satu record). */
async function getFirst(): Promise<HeroContent | null> {
  const { data, error } = await supabase
    .from("hero_contents")
    .select("*")
    .limit(1)
    .maybeSingle()

  if (error) throw wrapError(error, "Gagal memuat hero content")
  return (data as HeroContent | null) ?? null
}

async function getById(id: number | string): Promise<HeroContent | null> {
  const { data, error } = await supabase
    .from("hero_contents")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw wrapError(error, "Gagal memuat hero content")
  return (data as HeroContent | null) ?? null
}

/** Buat hero default bila belum ada. */
async function createDefault(
  fallback: HeroContentInput
): Promise<HeroContent> {
  const { data, error } = await supabase
    .from("hero_contents")
    .insert([{ ...fallback, is_active: true, sort_order: 0 }])
    .select()
    .single()

  if (error) throw wrapError(error, "Gagal membuat hero content")
  return data as HeroContent
}

async function uploadImage(file: File): Promise<string> {
  const path = `hero-content/${Date.now()}-${sanitizeFileName(file.name)}`
  return uploadFile(HERO_BUCKET, file, { path, upsert: true })
}

async function update(
  id: number | string,
  payload: HeroContentInput
): Promise<void> {
  const { error } = await supabase
    .from("hero_contents")
    .update(payload)
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal menyimpan hero content")
}

/** Realtime: panggil onChange tiap ada perubahan di tabel hero_contents. */
function subscribe(onChange: () => void): () => void {
  return subscribeTable(
    { channel: "hero_content_changes", table: "hero_contents", event: "*" },
    () => onChange()
  )
}

export const heroContentRepository = {
  fetchActive,
  getFirst,
  getById,
  createDefault,
  uploadImage,
  update,
  subscribe,
}
