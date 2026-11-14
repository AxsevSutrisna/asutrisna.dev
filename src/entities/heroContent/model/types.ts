/** Entity HeroContent (konten hero home, snake_case, tanpa mapper). */
export interface HeroContent {
  id: number | string
  badge_text: string | null
  title_line_1: string | null
  title_line_2: string | null
  typing_words: unknown
  description: string | null
  tech_badges: unknown
  cta_buttons: unknown
  hero_image_url: string | null
  hero_image_alt: string | null
  is_active: boolean
  sort_order: number | null
  created_at?: string | null
  [key: string]: unknown
}

export type HeroContentInput = Record<string, unknown>
