import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import { mapRows } from "@/shared/api/mapRows"
import { uploadFile, sanitizeFileName } from "@/shared/api/storage"
import {
  rowToProject,
  formToRow,
  MAX_PROJECT_IMAGES,
} from "@/entities/project/lib/projectMapper"
import type { ProjectFormValues } from "@/entities/project/lib/projectMapper"
import type { Project, ProjectRow } from "@/entities/project/model/types"

const PROJECT_IMAGES_BUCKET = "project-images"

/** Item gambar dari ProjectForm: `file` (baru) atau `url` (sudah ada). */
export interface ProjectImageItem {
  file?: File | null
  url?: string | null
}

/**
 * Satu-satunya pintu akses tabel `projects` (read + write + storage).
 * Komponen TIDAK boleh menyentuh supabase langsung — selalu lewat sini.
 */
async function fetchAll(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) throw wrapError(error, "Gagal memuat data projects")
  return mapRows(data as ProjectRow[] | null, rowToProject)
}

/**
 * Upload gambar baru (item.file) & pertahankan yang sudah ada (item.url).
 * Skema penamaan bucket `project-images` dipertahankan (`<ts>-<name>`),
 * tapi nama file kini disanitasi agar aman di public URL.
 */
async function uploadImages(items: ProjectImageItem[]): Promise<string[]> {
  const urls: string[] = []

  for (const item of (items ?? []).slice(0, MAX_PROJECT_IMAGES)) {
    if (item?.file) {
      const path = `${Date.now()}-${sanitizeFileName(item.file.name)}`
      urls.push(await uploadFile(PROJECT_IMAGES_BUCKET, item.file, { path }))
    } else if (item?.url) {
      urls.push(item.url)
    }
  }

  return [...new Set(urls)].slice(0, MAX_PROJECT_IMAGES)
}

async function create(form: ProjectFormValues, images: string[]): Promise<void> {
  const { error } = await supabase.from("projects").insert(formToRow(form, images))
  if (error) throw wrapError(error, "Gagal membuat project")
}

async function update(
  id: number | string,
  form: ProjectFormValues,
  images: string[]
): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .update(formToRow(form, images))
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui project")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus project")
}

/**
 * Simpan urutan baru. Update kolom `order_index` secara tertarget per-id
 * (bukan upsert seluruh baris) agar tak menimpa kolom lain.
 */
async function reorder(orderedIds: Array<number | string>): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("projects").update({ order_index: index }).eq("id", id)
    )
  )
  const failed = results.find((result) => result.error)
  if (failed?.error) {
    throw wrapError(failed.error, "Gagal menyimpan urutan project")
  }
}

export const projectRepository = {
  fetchAll,
  uploadImages,
  create,
  update,
  remove,
  reorder,
}
