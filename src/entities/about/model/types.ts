/** Entity AboutContent (snake_case; dikonsumsi apa adanya oleh UI, tanpa mapper). */
export interface AboutContent {
  id: number | string
  name: string | null
  description: string | null
  quote: string | null
  role_badges: unknown
  photo_url: string | null
  cv_en_url: string | null
  cv_id_url: string | null
  is_published: boolean
  version: number | null
  created_at?: string | null
  [key: string]: unknown
}

export interface AboutContentInput {
  name: string
  description: string
  quote: string
  role_badges: unknown
  photo_url: string
  cv_en_url: string
  cv_id_url: string
  is_published: boolean
  version: number
}
