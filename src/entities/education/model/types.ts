/** Entity Education (snake_case; normalisasi presentasi ada di utils). */
export interface Education {
  id: number | string
  school?: string | null
  degree?: string | null
  field_of_study?: string | null
  start_month?: number | null
  start_year?: number | null
  end_month?: number | null
  end_year?: number | null
  is_current?: boolean | null
  grade?: string | null
  activities?: string | null
  description?: string | null
  created_at?: string | null
  [key: string]: unknown
}

export type EducationInput = Record<string, unknown>
