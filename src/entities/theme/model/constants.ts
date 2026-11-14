/**
 * Kontrak warna tema. Kunci SENGAJA snake_case karena identik dengan kolom
 * tabel `site_theme`, nama CSS variable (via CSS_VAR_MAP di useTheme), dan
 * bentuk cache localStorage("theme_colors"). JANGAN di-camelCase.
 *
 * Catatan: hanya field yang benar-benar di-inject & dikonsumsi UI yang
 * disertakan. Field lama yang tak terpakai (states, navigation, forms/links,
 * glow/overlay, gradient, card light/border, button secondary-to) sudah dibuang
 * agar editor tetap ringkas dan tiap pilihan benar-benar berefek.
 */
export const THEME_COLOR_CATEGORIES: Record<
  string,
  { fields: string[]; label: string; hint: string }
> = {
  primary: {
    fields: ["primary_color_dark", "primary_color_light"],
    label: "Primary Colors",
    hint: "Main brand colors - used for primary UI elements and accents",
  },
  secondary: {
    fields: ["secondary_color_dark", "secondary_color_light"],
    label: "Secondary Colors",
    hint: "Secondary brand colors - used for secondary UI elements",
  },
  backdrop: {
    fields: ["backdrop_base", "backdrop_glow"],
    label: "Backdrop Colors",
    hint: "Background and glow effects for the page backdrop",
  },
  background: {
    fields: [
      "background_blob_one",
      "background_blob_two",
      "background_blob_three",
      "background_blob_four",
      "background_grid_line",
    ],
    label: "Background Elements",
    hint: "Animated blobs and grid overlay colors",
  },
  buttons: {
    fields: [
      "button_primary_from",
      "button_primary_to",
      "button_secondary_from",
      "button_outline_color",
    ],
    label: "Button Colors",
    hint: "Button gradient and outline colors for interactive elements",
  },
  cards: {
    fields: ["card_bg_dark"],
    label: "Card Colors",
    hint: "Background color for cards and containers",
  },
  text: {
    fields: ["text_primary", "text_secondary", "text_muted"],
    label: "Text Colors",
    hint: "Text colors for primary, secondary, and muted content",
  },
  border: {
    fields: ["border_light", "border_dark"],
    label: "Border Colors",
    hint: "Border colors for light and dark contexts",
  },
  effects: {
    fields: ["shadow_primary_color"],
    label: "Effects & Shadows",
    hint: "Shadow color for elevated elements",
  },
}

export const DEFAULT_THEME: Record<string, string> = {
  // Primary and Secondary Colors
  primary_color_dark: "#6366f1",
  primary_color_light: "#a855f7",
  secondary_color_dark: "#8b5cf6",
  secondary_color_light: "#c084fc",

  // Backdrop
  backdrop_base: "#030014",
  backdrop_glow: "#1b123d",

  // Background Elements
  background_blob_one: "#6366f1",
  background_blob_two: "#a855f7",
  background_blob_three: "#ec4899",
  background_blob_four: "#8b5cf6",
  background_grid_line: "#6366f1",

  // Text Colors
  text_primary: "#f5f3ff",
  text_secondary: "#d8d4e8",
  text_muted: "#64748b",

  // Borders
  border_light: "#e5e0ff",
  border_dark: "#3d394e",

  // Buttons
  button_primary_from: "#6366f1",
  button_primary_to: "#a855f7",
  button_secondary_from: "#a855f7",
  button_outline_color: "#a855f7",

  // Cards
  card_bg_dark: "#1e1b4b",

  // Effects
  shadow_primary_color: "#6366f1",
}
