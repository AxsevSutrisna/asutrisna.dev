/** Entity Course (snake_case konsisten DB+UI, tanpa mapper). */
export interface Course {
  id: number | string
  title: string | null
  provider: string | null
  completion_date: string | null
  description: string | null
  img_url: string | null
  certificate_link: string | null
  sort_order: number | null
  created_at?: string | null
}
