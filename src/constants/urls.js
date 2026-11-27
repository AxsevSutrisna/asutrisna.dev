// Canonical primary origin for SEO (canonical URL, Open Graph, JSON-LD, sitemap).
// Always points to the production domain regardless of which host actually serves
// the app, so the *.vercel.app and preview URLs consolidate to the primary domain
// instead of creating duplicate content. Override via VITE_SITE_URL if the primary
// domain ever changes.
export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_URL || "https://asutrisnadev.my.id"
).replace(/\/$/, "")

export const FALLBACK_SITE_ORIGIN = SITE_ORIGIN

export const FALLBACK_GITHUB = "https://github.com/AxsevSutrisna"

export const FORM_SUBMIT_ENDPOINT =
  "https://formsubmit.co/ajax/asepsutrisnasp@gmail.com"

export const SIMPLE_ICONS_BASE = "https://cdn.simpleicons.org"

export const GOOGLE_DRIVE_DOWNLOAD_BASE =
  "https://drive.google.com/uc?export=download"

export const STATIC_PATHS = {
  PHOTO: "/AsepSutrisnaSuhadaPutra-PhotoProfile.png",
  HERO_FALLBACK: "/Photo.jpg",
  META_FALLBACK: "/Meta.png",
  HERO_DASHBOARD_DEFAULT: "/Animation1.gif",
  GRID_SVG: "/grid.svg",
}
