import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-2xl flex flex-col"
        style={{ maxHeight: "calc(100vh - 24px)" }}
      >
        <div
          className="absolute -inset-0.5 rounded-2xl blur opacity-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
          }}
        />
        <div className="relative bg-[#0a0a1a] border border-white/12 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="cursor-target p-1 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}
