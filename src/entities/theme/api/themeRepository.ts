import { supabase } from "@/shared/api/supabaseClient"
import { subscribe as subscribeTable } from "@/shared/api/realtime"
import { DEFAULT_THEME } from "@/entities/theme/model/constants"

export type ThemeColors = Record<string, string>

/** Ambil tema aktif (row id=1). Fallback DEFAULT_THEME bila kosong/gagal. */
export async function fetchTheme(): Promise<ThemeColors> {
  try {
    const { data, error } = await supabase
      .from("site_theme")
      .select("*")
      .eq("id", 1)
      .maybeSingle()

    if (error) throw error
    return (data as ThemeColors | null) || DEFAULT_THEME
  } catch (error) {
    console.error("Error fetching theme:", error)
    return DEFAULT_THEME
  }
}

/** Simpan tema (upsert id=1). `background_grid_line_soft` dibuang (bukan kolom). */
export async function updateTheme(colors: ThemeColors): Promise<ThemeColors> {
  try {
    const validColors = { ...colors }
    delete validColors.background_grid_line_soft

    const { data, error } = await supabase
      .from("site_theme")
      .upsert({ id: 1, ...validColors }, { onConflict: "id" })
      .select()
      .maybeSingle()

    if (error) throw error
    return (
      (data as ThemeColors | null) ||
      ({ id: 1, ...validColors } as unknown as ThemeColors)
    )
  } catch (error) {
    console.error("Error updating theme:", error)
    throw error
  }
}

/** Reset tema ke DEFAULT_THEME. */
export async function resetTheme(): Promise<ThemeColors> {
  try {
    const { data, error } = await supabase
      .from("site_theme")
      .upsert({ id: 1, ...DEFAULT_THEME }, { onConflict: "id" })
      .select()
      .maybeSingle()

    if (error) throw error
    return (
      (data as ThemeColors | null) ||
      ({ id: 1, ...DEFAULT_THEME } as unknown as ThemeColors)
    )
  } catch (error) {
    console.error("Error resetting theme:", error)
    throw error
  }
}

/** Realtime: panggil onUpdate(row) tiap row site_theme id=1 di-UPDATE. */
export function subscribeTheme(
  onUpdate: (row: ThemeColors) => void
): () => void {
  return subscribeTable(
    {
      channel: "site_theme_changes",
      table: "site_theme",
      event: "UPDATE",
      filter: "id=eq.1",
    },
    (payload) => {
      if (payload.new) onUpdate(payload.new as ThemeColors)
    }
  )
}

export const themeRepository = {
  fetchTheme,
  updateTheme,
  resetTheme,
  subscribeTheme,
}
