import { useCallback, useState } from "react"

/**
 * Store toast per-layar. Auto-dismiss + animasi keluar ditangani di
 * komponen ToastStack (ToastItem), jadi hook ini cukup menyimpan daftar.
 * `timeout` disimpan sebagai `duration` pada tiap toast (0/negatif = persisten).
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((type, message, timeout = 3500) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((current) => [
      ...current,
      { id, type, message, duration: timeout },
    ])
    return id
  }, [])

  return { toasts, pushToast, removeToast }
}
