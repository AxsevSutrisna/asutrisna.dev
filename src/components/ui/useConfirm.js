import { createContext, useContext } from "react"

/**
 * Context + hook untuk dialog konfirmasi reusable.
 *
 * Pakai:
 *   const confirm = useConfirm()
 *   const ok = await confirm({ title, message, confirmText, tone: "danger" })
 *   if (!ok) return
 *
 * `confirm("pesan")` juga valid (string dipakai sebagai message).
 * Butuh <ConfirmProvider> membungkus aplikasi (lihat App.jsx).
 */
export const ConfirmContext = createContext(null)

export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) {
    throw new Error("useConfirm must be used within a <ConfirmProvider>")
  }
  return confirm
}
