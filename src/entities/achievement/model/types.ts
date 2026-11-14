/**
 * Entity Achievement.
 *
 * CATATAN: domain ini sudah konsisten snake_case di DB maupun UI (publik &
 * admin) tanpa varian casing/defensif, jadi TIDAK ada mapper — penggantian
 * camelCase di sini murni churn tanpa manfaat korektness (lihat prinsip plan).
 */
export interface Achievement {
  id: number | string
  title: string
  deskripsi: string | null
  place: string | null
  badge_text: string | null
  date: string | null
  level_competition: string | null
  sort_order: number | null
  created_at?: string | null
}

/** Nilai input dari AchievementForm untuk create/update. */
export interface AchievementInput {
  title: string
  deskripsi: string
  place: string
  badge_text: string
  date: string
  level_competition: string
  sort_order: number
}
