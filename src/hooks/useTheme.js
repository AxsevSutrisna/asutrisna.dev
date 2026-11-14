import { useEffect } from "react"
import { DEFAULT_THEME } from "@/entities/theme/model/constants"
import {
  fetchTheme,
  subscribeTheme,
} from "@/entities/theme/api/themeRepository"

const CSS_VAR_MAP = {
  // Primary and Secondary
  primary_color_dark: "--color-primary-dark",
  primary_color_light: "--color-primary-light",
  secondary_color_dark: "--color-secondary-dark",
  secondary_color_light: "--color-secondary-light",

  // Backdrop
  backdrop_base: "--color-backdrop-base",
  backdrop_glow: "--color-backdrop-glow",

  // Background
  background_blob_one: "--color-background-blob-one",
  background_blob_two: "--color-background-blob-two",
  background_blob_three: "--color-background-blob-three",
  background_blob_four: "--color-background-blob-four",
  background_grid_line: "--color-grid-line",

  // Text
  text_primary: "--color-text-primary",
  text_secondary: "--color-text-secondary",
  text_muted: "--color-text-muted",

  // Border
  border_light: "--color-border-light",
  border_dark: "--color-border-dark",

  // Buttons
  button_primary_from: "--color-button-primary-from",
  button_primary_to: "--color-button-primary-to",
  button_secondary_from: "--color-button-secondary-from",
  button_outline_color: "--color-button-outline",

  // Cards
  card_bg_dark: "--color-card-bg-dark",

  // Effects
  shadow_primary_color: "--color-shadow-primary",
}

const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const hexToRgbTriplet = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

const injectCSSVariables = (colors) => {
  const root = document.documentElement

  // Inject color variables
  Object.entries(CSS_VAR_MAP).forEach(([key, cssVar]) => {
    const value = colors[key] || DEFAULT_THEME[key]
    root.style.setProperty(cssVar, value)
  })

  // Inject RGB variants for color-mix
  if (colors.backdrop_base) {
    root.style.setProperty(
      "--color-backdrop-base-rgb",
      hexToRgbTriplet(colors.backdrop_base)
    )
  }

  if (colors.backdrop_glow) {
    root.style.setProperty(
      "--color-backdrop-glow-rgb",
      hexToRgbTriplet(colors.backdrop_glow)
    )
  }

  if (colors.primary_color_dark) {
    root.style.setProperty(
      "--color-primary-dark-rgb",
      hexToRgbTriplet(colors.primary_color_dark)
    )
  }

  if (colors.primary_color_light) {
    root.style.setProperty(
      "--color-primary-light-rgb",
      hexToRgbTriplet(colors.primary_color_light)
    )
  }

  // Inject grid line variants with proper opacity
  const gridBase = colors.background_grid_line || colors.primary_color_dark
  const gridSoft = colors.background_grid_line_soft || colors.primary_color_dark

  root.style.setProperty("--color-grid-line", hexToRgba(gridBase, 0.035))
  root.style.setProperty("--color-grid-line-soft", hexToRgba(gridSoft, 0.018))
}

const buildColors = (source) => {
  const colors = {}
  Object.keys(CSS_VAR_MAP).forEach((key) => {
    colors[key] = source[key] || DEFAULT_THEME[key]
  })
  return colors
}

const applyColors = (source) => {
  const colors = buildColors(source)
  injectCSSVariables(colors)
  try {
    localStorage.setItem("theme_colors", JSON.stringify(colors))
  } catch {
    // ignore storage errors (private mode / blocked)
  }
}

export const useTheme = () => {
  useEffect(() => {
    let unsubscribe = null

    const setupTheme = async () => {
      try {
        const cached = localStorage.getItem("theme_colors")
        if (cached) injectCSSVariables(JSON.parse(cached))
      } catch {
        // ignore cache read errors
      }

      try {
        const data = await fetchTheme()
        if (data) applyColors(data)

        // Realtime via idempotent, StrictMode-safe shared helper.
        unsubscribe = subscribeTheme((row) => applyColors(row))
      } catch (error) {
        console.error("Error setting up theme:", error)
      }
    }

    setupTheme()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])
}
