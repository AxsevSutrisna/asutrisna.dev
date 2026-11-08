/**
 * @deprecated Re-export shim. Konstanta tema ada di
 * `src/entities/theme/model/constants.ts` dan fungsi akses data di
 * `src/entities/theme/api/themeRepository.ts`. Impor baru sebaiknya dari sana.
 *
 * Kunci warna SENGAJA snake_case (kontrak CSS + localStorage) — jangan diubah.
 */
export {
  THEME_COLOR_CATEGORIES,
  DEFAULT_THEME,
} from "@/entities/theme/model/constants"
export {
  fetchTheme,
  updateTheme,
  resetTheme,
} from "@/entities/theme/api/themeRepository"
