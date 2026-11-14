import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Pagination reusable + theme-aware untuk list dashboard yang dipaginasi
 * server-side. Tombol halaman aktif memakai warna primary dari theme.
 *
 * Props:
 *  - page: number        halaman aktif (1-based)
 *  - totalPages: number  total halaman
 *  - onChange: (p) => void
 *  - className?: string
 */

/** Deret nomor halaman dengan elipsis untuk total besar. */
function buildPages(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages = [1]
  if (page > 3) pages.push("…")
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (page < totalPages - 2) pages.push("…")
  pages.push(totalPages)
  return pages
}

const arrowClass =
  "cursor-target flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-gray-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5"

export default function Pagination({ page, totalPages, onChange, className = "" }) {
  if (!totalPages || totalPages <= 1) return null

  const go = (p) => {
    const next = Math.min(totalPages, Math.max(1, p))
    if (next !== page) onChange(next)
  }

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={arrowClass}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {buildPages(page, totalPages).map((p, idx) =>
        p === "…" ? (
          <span
            key={`gap-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-gray-600 text-sm select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? "page" : undefined}
            className={`cursor-target w-9 h-9 rounded-lg border text-sm font-medium transition-all ${
              p === page
                ? "border-transparent text-white shadow-sm"
                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
            style={
              p === page
                ? {
                    backgroundImage:
                      "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))",
                  }
                : undefined
            }
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={arrowClass}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
