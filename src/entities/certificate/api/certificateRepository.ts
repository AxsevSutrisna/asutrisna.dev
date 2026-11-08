import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import { mapRows } from "@/shared/api/mapRows"
import { uploadFile, sanitizeFileName } from "@/shared/api/storage"
import { rowToCertificate } from "@/entities/certificate/lib/certificateMapper"
import type {
  Certificate,
  CertificateRow,
} from "@/entities/certificate/model/types"

const CERTIFICATE_BUCKET = "certificate-images"

async function fetchAll(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw wrapError(error, "Gagal memuat certificates")
  return mapRows(data as CertificateRow[] | null, rowToCertificate)
}

async function create(file: File): Promise<void> {
  const path = `cert-${Date.now()}-${sanitizeFileName(file.name)}`
  const url = await uploadFile(CERTIFICATE_BUCKET, file, { path })

  const { error } = await supabase.from("certificates").insert({ img: url })
  if (error) throw wrapError(error, "Gagal menyimpan certificate")
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("certificates").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus certificate")
}

export const certificateRepository = { fetchAll, create, remove }
