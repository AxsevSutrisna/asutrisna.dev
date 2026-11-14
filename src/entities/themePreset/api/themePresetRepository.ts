import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"

export interface ThemePreset {
  id: number | string
  name: string
  description?: string | null
  vibe?: string | null
  use_case?: string | null
  category?: string | null
  color_scheme: Record<string, string>
  is_default?: boolean
  is_featured?: boolean
}

/** Ambil semua preset tema. color_scheme dinormalkan jadi objek (bisa string di DB). */
async function fetchAll(): Promise<ThemePreset[]> {
  const { data, error } = await supabase
    .from("theme_presets")
    .select(
      "id, name, description, vibe, use_case, category, color_scheme, is_default, is_featured"
    )
    .order("is_featured", { ascending: false })
    .order("id", { ascending: true })

  if (error) throw wrapError(error, "Gagal memuat preset tema")

  const rows = (data ?? []) as Array<Record<string, unknown>>
  return rows.map((row) => {
    const scheme = row.color_scheme
    return {
      ...(row as unknown as ThemePreset),
      color_scheme: (typeof scheme === "string"
        ? JSON.parse(scheme)
        : scheme) as Record<string, string>,
    }
  })
}

export const themePresetRepository = { fetchAll }
