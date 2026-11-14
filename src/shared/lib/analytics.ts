import { env } from "@/shared/config/env"

/**
 * Integrasi Google Analytics 4 (gtag.js) untuk SPA.
 *
 * - Script dimuat dinamis (hanya bila Measurement ID tersedia di env).
 * - `send_page_view: false` agar page_view dikontrol manual per-route (SPA),
 *   mencegah hanya 1 kunjungan tercatat walau pindah banyak halaman.
 */

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = env.gaMeasurementId
let initialized = false

/** Aktif hanya bila ada Measurement ID & berjalan di browser. */
export function analyticsEnabled(): boolean {
  return Boolean(MEASUREMENT_ID) && typeof window !== "undefined"
}

/** Muat gtag.js sekali & konfigurasikan GA4. Idempoten (aman untuk StrictMode). */
export function initAnalytics(): void {
  if (initialized || !analyticsEnabled()) return
  initialized = true

  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  const gtag = (...args: unknown[]) => {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag("js", new Date())
  gtag("config", MEASUREMENT_ID, { send_page_view: false })
}

/** Kirim page_view manual untuk tiap perubahan route di SPA. */
export function trackPageView(path: string): void {
  if (!initialized || !analyticsEnabled()) return
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

/** Kirim event kustom (mis. klik CTA, submit form kontak, unduh CV). */
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {}
): void {
  if (!initialized || !analyticsEnabled()) return
  window.gtag("event", name, params)
}
