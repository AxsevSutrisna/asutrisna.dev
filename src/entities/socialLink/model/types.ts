/** Entity SocialLink (snake_case konsisten DB+UI, tanpa mapper). */
export interface SocialLink {
  id: number | string
  platform: string | null
  display_name: string | null
  sub_text: string | null
  url: string | null
  icon: string | null
  color: string | null
  gradient: string | null
  sort_order: number | null
  is_primary: boolean
  is_active: boolean
  created_at?: string | null
}

export interface SocialLinkInput {
  platform: string
  display_name: string
  sub_text: string
  url: string
  icon: string | null
  color: string
  sort_order: number
  is_primary: boolean
  is_active: boolean
}
