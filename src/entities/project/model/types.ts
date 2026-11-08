/** Entity domain Project — satu bentuk kanonik (camelCase) untuk seluruh UI. */
export interface Project {
  id: number | string
  title: string
  description: string
  /** Gambar utama (cover). */
  img: string
  /** Semua gambar (deduped, dibatasi MAX 6). */
  images: string[]
  techStack: string[]
  features: string[]
  link: string
  github: string
  category: string
  orderIndex: number | null
  isPublished: boolean
  createdAt: string | null
  /** Diturunkan dari toSlug(title) — dipakai untuk routing /project/:slug. */
  slug: string
}

/**
 * Bentuk baris mentah dari tabel `projects`. Longgar & toleran casing karena
 * data lama bisa snake_case / PascalCase / CSV. Semua dinormalkan di mapper.
 */
export interface ProjectRow {
  id: number | string
  title?: string | null
  Title?: string | null
  description?: string | null
  Description?: string | null
  img?: string | null
  Img?: string | null
  image?: string | null
  Image?: string | null
  images?: unknown
  Images?: unknown
  tech_stack?: unknown
  techstack?: unknown
  TechStack?: unknown
  features?: unknown
  Features?: unknown
  link?: string | null
  Link?: string | null
  github?: string | null
  Github?: string | null
  category?: string | null
  Category?: string | null
  order_index?: number | null
  is_published?: boolean | null
  created_at?: string | null
  [key: string]: unknown
}
