import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AlertTriangle, X } from "lucide-react"
import { ConfirmContext } from "./useConfirm"

const DEFAULTS = {
  title: "Are you sure?",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  tone: "default", // "default" | "danger"
}

function ConfirmDialog({ options, onResolve }) {
  const confirmBtnRef = useRef(null)
  const [show, setShow] = useState(false)
  const isDanger = options.tone === "danger"

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true))
    confirmBtnRef.current?.focus()

    const onKey = (e) => {
      if (e.key === "Escape") onResolve(false)
    }
    window.addEventListener("keydown", onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onResolve])

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onResolve(false)
      }}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={options.title}
        style={{ backgroundColor: "var(--color-backdrop-base, #0a0a1a)" }}
        className={`w-full max-w-sm transform-gpu rounded-2xl border border-white/10 p-6 shadow-2xl transition-all duration-200 motion-reduce:transition-none ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start gap-4">
          <span
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              isDanger ? "border-red-500/30 bg-red-500/15 text-red-400" : ""
            }`}
            style={
              isDanger
                ? undefined
                : {
                    color: "var(--color-primary-light)",
                    borderColor:
                      "color-mix(in srgb, var(--color-primary-light) 35%, transparent)",
                    backgroundColor:
                      "color-mix(in srgb, var(--color-primary-dark) 20%, transparent)",
                  }
            }
          >
            <AlertTriangle className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white">
              {options.title}
            </h3>
            {options.message && (
              <p className="mt-1 text-sm leading-relaxed text-gray-400">
                {options.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onResolve(false)}
            aria-label="Close"
            className="cursor-target -mr-1 -mt-1 shrink-0 rounded-md p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white no-neo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onResolve(false)}
            className="cursor-target rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white no-neo"
          >
            {options.cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => onResolve(true)}
            className={`cursor-target rounded-xl px-4 py-2 text-sm font-medium transition-all no-neo ${
              isDanger
                ? "border border-red-500/40 bg-red-500/20 text-red-200 hover:bg-red-500/30"
                : "border border-white/10 text-white hover:brightness-110"
            }`}
            style={
              isDanger
                ? undefined
                : {
                    background:
                      "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
                  }
            }
          >
            {options.confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Provider dialog konfirmasi global. Membungkus aplikasi sekali di App.jsx,
 * lalu komponen mana pun memanggil `const confirm = useConfirm()`.
 */
export default function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null)
  const resolverRef = useRef(null)

  const confirm = useCallback((input) => {
    const opts =
      typeof input === "string"
        ? { ...DEFAULTS, message: input }
        : { ...DEFAULTS, ...input }
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setOptions(opts)
    })
  }, [])

  const resolve = useCallback((result) => {
    resolverRef.current?.(result)
    resolverRef.current = null
    setOptions(null)
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options &&
        createPortal(
          <ConfirmDialog options={options} onResolve={resolve} />,
          document.body
        )}
    </ConfirmContext.Provider>
  )
}
