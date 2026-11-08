import { useEffect, useState } from "react"
import { sessionRepository } from "@/entities/session/api/sessionRepository"

/**
 * Guard admin untuk ProtectedRoute.
 * `null` = masih cek, `true` = admin, `false` = tolak.
 * Mounted-flag guard agar aman terhadap StrictMode double-effect.
 */
export function useAdminGuard(): boolean | null {
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true
    sessionRepository
      .isAdmin()
      .then((ok) => {
        if (active) setAllowed(ok)
      })
      .catch(() => {
        if (active) setAllowed(false)
      })
    return () => {
      active = false
    }
  }, [])

  return allowed
}
