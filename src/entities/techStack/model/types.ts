/** Entity TechStack (snake_case konsisten DB+UI, tanpa mapper). */
export interface TechStack {
  id: number | string
  name: string
  slug: string
  category: string | null
  description: string | null
  icon_url: string | null
  sort_order: number | null
  is_active: boolean
  created_at?: string | null
}

export interface TechStackInput {
  name: string
  slug: string
  category: string | null
  description: string | null
  icon_url: string | null
  sort_order: number
  is_active: boolean
}
