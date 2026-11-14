import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import { uploadFile, sanitizeFileName } from "@/shared/api/storage"
import type { Course } from "@/entities/course/model/types"

const COURSE_BUCKET = "course-images"

/** Field yang bisa diedit dari dashboard (snake_case konsisten DB). */
export interface CourseInput {
  title: string
  provider: string
  completion_date: string | null
  certificate_link: string | null
  description: string | null
}

/** Urutan untuk halaman publik: mengikuti sort_order. */
async function fetchAll(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) throw wrapError(error, "Gagal memuat courses")
  return (data ?? []) as Course[]
}

/** Urutan untuk dashboard admin: terbaru di atas. */
async function list(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw wrapError(error, "Gagal memuat courses")
  return (data ?? []) as Course[]
}

async function uploadImage(file: File): Promise<string> {
  const path = `course-${Date.now()}-${sanitizeFileName(file.name)}`
  return uploadFile(COURSE_BUCKET, file, { path })
}

async function create(input: CourseInput, file?: File | null): Promise<void> {
  const img_url = file ? await uploadImage(file) : null
  const { error } = await supabase
    .from("courses")
    .insert([{ ...input, img_url }])

  if (error) throw wrapError(error, "Gagal menyimpan course")
}

async function update(
  id: number | string,
  input: CourseInput,
  file?: File | null,
  currentImgUrl?: string | null
): Promise<void> {
  const img_url = file ? await uploadImage(file) : (currentImgUrl ?? null)
  const { error } = await supabase
    .from("courses")
    .update({ ...input, img_url })
    .eq("id", id)

  if (error) throw wrapError(error, "Gagal memperbarui course")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("courses").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus course")
}

export const courseRepository = {
  fetchAll,
  list,
  uploadImage,
  create,
  update,
  remove,
}
