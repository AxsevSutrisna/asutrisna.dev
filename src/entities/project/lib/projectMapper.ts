import { toSlug } from "@/shared/lib/slug"
import type { Project, ProjectRow } from "@/entities/project/model/types"

/** Batas jumlah gambar per project (dipertahankan dari kode lama). */
export const MAX_PROJECT_IMAGES = 6

/** Ambil kandidat pertama yang berupa array / CSV string menjadi string[]. */
function toStringArray(...candidates: unknown[]): string[] {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map((item) => String(item).trim()).filter(Boolean)
    }
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    }
  }
  return []
}

/** Kumpulkan & dedup semua gambar dari varian field (images/Images/img/Img/...). */
function normalizeImages(row: ProjectRow): string[] {
  const out: string[] = []

  const push = (value: unknown): void => {
    if (!value) return
    if (Array.isArray(value)) {
      value.forEach(push)
      return
    }
    if (typeof value === "string") {
      const trimmed = value.trim()
      if (trimmed) out.push(trimmed)
    }
  }

  push(row.images)
  push(row.Images)
  push(row.img)
  push(row.Img)
  push(row.image)
  push(row.Image)

  return [...new Set(out)].slice(0, MAX_PROJECT_IMAGES)
}

/** Pisah CSV / array menjadi string[] bersih. */
export function splitCsv(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
  }
  return []
}

/** Nilai mentah dari ProjectForm (tech stack & features berupa CSV string). */
export interface ProjectFormValues {
  title: string
  description: string
  techstack: string
  features: string
  link: string
  github: string
  category: string
}

/** Payload insert/update ke tabel `projects` (snake_case — batas DB). */
export interface ProjectInsert {
  title: string
  description: string
  img: string
  images: string[]
  tech_stack: string[]
  features: string[]
  link: string
  github: string
  category: string
}

/** Peta nilai form + daftar URL gambar -> payload baris DB. */
export function formToRow(
  form: ProjectFormValues,
  images: string[]
): ProjectInsert {
  return {
    title: form.title,
    description: form.description,
    img: images[0] ?? "",
    images,
    tech_stack: splitCsv(form.techstack),
    features: splitCsv(form.features),
    link: form.link,
    github: form.github,
    category: form.category,
  }
}

const str = (value: unknown): string => (value == null ? "" : String(value).trim())

/**
 * Peta satu baris DB -> entity Project kanonik.
 * Menyerap seluruh normalisasi defensif yang dulu tersebar di ProjectDetail
 * (casing title/Title, tech_stack/techstack/TechStack, CSV<->array, dedup gambar).
 * Field dibiarkan "mentah" (tanpa fallback presentasi seperti "#"/FALLBACK_GITHUB)
 * supaya komponen list vs detail tetap bisa menampilkan fallback masing-masing.
 */
export function rowToProject(row: ProjectRow): Project {
  const title = str(row.title ?? row.Title)
  const images = normalizeImages(row)

  return {
    id: row.id,
    title,
    description: str(row.description ?? row.Description),
    img: str(row.img ?? row.Img) || images[0] || "",
    images,
    techStack: toStringArray(row.tech_stack, row.techstack, row.TechStack),
    features: toStringArray(row.features, row.Features),
    link: str(row.link ?? row.Link),
    github: str(row.github ?? row.Github),
    category: str(row.category ?? row.Category),
    orderIndex: typeof row.order_index === "number" ? row.order_index : null,
    isPublished: row.is_published ?? true,
    createdAt: row.created_at ?? null,
    slug: toSlug(title),
  }
}
