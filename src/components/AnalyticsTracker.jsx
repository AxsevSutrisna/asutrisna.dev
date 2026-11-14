import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { initAnalytics, trackPageView } from "@/shared/lib/analytics"

/**
 * Menginisialisasi GA4 & mengirim page_view setiap kali route berubah.
 * Harus dirender di dalam <BrowserRouter> agar useLocation tersedia.
 * Tidak merender apa pun.
 */
export default function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search])

  return null
}
