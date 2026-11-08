import { useCallback, useEffect, useState } from "react"
import PropTypes from "prop-types"
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react"

/**
 * Konfigurasi per-tipe toast: ikon, warna aksen (bar kiri + progress), dan
 * gaya chip ikon. Satu sumber kebenaran agar semua toast seragam.
 */
const CONFIG = {
  success: {
    Icon: CheckCircle2,
    accent: "#34d399",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  error: {
    Icon: AlertCircle,
    accent: "#fb7185",
    chip: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  warning: {
    Icon: AlertTriangle,
    accent: "#fbbf24",
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  info: {
    Icon: Info,
    accent: "#60a5fa",
    chip: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  },
}

function ToastItem({ toast, onDismiss }) {
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const duration = typeof toast.duration === "number" ? toast.duration : 3500
  const cfg = CONFIG[toast.type] || CONFIG.info
  const { Icon } = cfg

  // Animasi masuk pada frame berikutnya (agar transisi terpicu).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const dismiss = useCallback(() => {
    setLeaving(true)
    // Beri waktu animasi keluar sebelum dihapus dari state.
    setTimeout(() => onDismiss?.(toast.id), 200)
  }, [onDismiss, toast.id])

  // Auto-dismiss (0 atau negatif = persisten).
  useEffect(() => {
    if (duration <= 0) return undefined
    const timer = setTimeout(dismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, dismiss])

  const visible = show && !leaving

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={`pointer-events-auto origin-right transform-gpu transition-all duration-200 ease-out motion-reduce:transition-none ${
        visible
          ? "translate-x-0 scale-100 opacity-100"
          : "translate-x-5 scale-95 opacity-0"
      }`}
    >
      <div
        className="relative flex items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b1a]/85 py-3.5 pl-4 pr-3 shadow-2xl backdrop-blur-xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-backdrop-base) 85%, transparent)",
        }}
      >
        {/* Bar aksen kiri */}
        <span
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: cfg.accent }}
        />

        {/* Chip ikon */}
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${cfg.chip}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        {/* Pesan */}
        <p className="min-w-0 flex-1 break-words py-0.5 text-sm leading-relaxed text-gray-100">
          {toast.message}
        </p>

        {/* Tombol tutup */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="cursor-target mt-0.5 shrink-0 rounded-md p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress auto-dismiss */}
        {duration > 0 && (
          <span
            className="absolute bottom-0 left-0 h-0.5 motion-reduce:hidden"
            style={{
              width: show ? "0%" : "100%",
              transition: `width ${duration}ms linear`,
              backgroundColor: cfg.accent,
              opacity: 0.55,
            }}
          />
        )}
      </div>
    </div>
  )
}

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    message: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
  onDismiss: PropTypes.func,
}

export default function ToastStack({ toasts = [], onDismiss }) {
  if (!toasts.length) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

ToastStack.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string,
      message: PropTypes.string,
      duration: PropTypes.number,
    })
  ),
  onDismiss: PropTypes.func,
}
