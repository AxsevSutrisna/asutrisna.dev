export const TYPING_SPEED = 100
export const ERASING_SPEED = 50
export const PAUSE_DURATION = 2000
export const FALLBACK_SITE_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : ""

export const normalizeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }
  return []
}

export const normalizeCtaButtons = (value) =>
  normalizeArray(value)
    .map((button) => {
      if (!button || typeof button !== "object") return null
      const label = button.label?.trim?.() || ""
      const url = button.url?.trim?.() || ""
      if (!label || !url) return null
      return { label, url }
    })
    .filter(Boolean)

export const buildPageTitle = (heroData) => {
  const titleParts = [heroData?.title_line_1, heroData?.title_line_2]
    .map((part) => part?.trim())
    .filter(Boolean)
  return titleParts.join("").trim()
}
