/** Entity WorkExperience (snake_case; normalisasi presentasi ada di utils). */
export interface WorkExperience {
  id: number | string
  position?: string | null
  company?: string | null
  employment_type?: string | null
  location?: string | null
  start_month?: number | null
  start_year?: number | null
  end_month?: number | null
  end_year?: number | null
  is_current?: boolean | null
  description?: string | null
  tech_stack?: unknown
  display_order?: number | null
  created_at?: string | null
  [key: string]: unknown
}

/** Payload insert/update (dibentuk oleh buildWorkExperiencePayload di utils). */
export type WorkExperienceInput = Record<string, unknown>
