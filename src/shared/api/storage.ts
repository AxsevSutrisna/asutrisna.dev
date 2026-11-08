import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"

/** Sanitasi nama file agar aman dipakai di public URL (hindari spasi/char tak aman). */
export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export interface UploadOptions {
  /**
   * Path/objek-key kustom di dalam bucket. Bila tidak diisi, default
   * `${Date.now()}-${sanitizeFileName(file.name)}`.
   * CATATAN: tiap bucket punya skema penamaan sendiri — teruskan `path`
   * agar skema itu tetap konsisten (lihat risiko "2 bucket storage" di plan).
   */
  path?: string
  cacheControl?: string
  upsert?: boolean
}

/**
 * Upload satu file ke Supabase Storage dan kembalikan public URL-nya.
 * Helper komposabel dipakai oleh repository (bukan oleh komponen).
 */
export async function uploadFile(
  bucket: string,
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const path = options.path ?? `${Date.now()}-${sanitizeFileName(file.name)}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: options.cacheControl,
    upsert: options.upsert ?? false,
  })

  if (error) throw wrapError(error, `Gagal upload ke bucket "${bucket}"`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
