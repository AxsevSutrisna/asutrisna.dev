import { useEffect } from "react"
import { useAchievementStore } from "@/store/useAchievementStore"
import { Trophy } from "lucide-react"

/* Gradien warna serupa avatar perusahaan di ExperienceHighlight */
const AVATAR_COLORS = [
  "linear-gradient(135deg, #6366f1, #818cf8)",
  "linear-gradient(135deg, #3b82f6, #60a5fa)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #06b6d4, #22d3ee)",
  "linear-gradient(135deg, #10b981, #34d399)",
]

/* Penempatan bento responsif menurut jumlah item & posisi. */
const getGridClasses = (index, totalItems) => {
  if (totalItems === 1) return "md:col-span-2 lg:col-span-3 lg:row-span-2"
  if (totalItems === 2)
    return index === 0
      ? "md:col-span-2 lg:col-span-2 lg:row-span-2"
      : "col-span-1 lg:col-span-1 lg:row-span-2"
  if (totalItems === 3)
    return index === 0
      ? "md:col-span-2 lg:col-span-2 lg:row-span-2"
      : "col-span-1 lg:col-span-1 lg:row-span-1"
  if (totalItems === 4) {
    if (index === 0) return "md:col-span-2 lg:col-span-2 lg:row-span-1"
    if (index === 3) return "md:col-span-2 lg:col-span-2 lg:row-span-1"
    return "col-span-1 lg:col-span-1 lg:row-span-1"
  }
  if (totalItems === 5) {
    if (index === 0) return "md:col-span-2 lg:col-span-2 lg:row-span-2"
    if (index === 3) return "md:col-span-2 lg:col-span-2 lg:row-span-1"
    return "col-span-1 lg:col-span-1 lg:row-span-1"
  }
  return index === 0
    ? "md:col-span-2 lg:col-span-2 lg:row-span-2"
    : "col-span-1 lg:col-span-1 lg:row-span-1"
}

export default function AchievementHighlight() {
  const { achievements, fetchAchievements, loading } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  if (loading) {
    return (
      <div className="py-24 text-center text-base text-gray-500">
        Loading achievements...
      </div>
    )
  }

  const highlighted = achievements ? achievements.slice(0, 5) : []
  const total = highlighted.length

  if (total === 0 && !loading) return null

  return (
    <section
      id="AchievementHighlight"
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-14 sm:py-20 lg:py-24"
      style={{ backgroundColor: "var(--color-backdrop-base)" }}
      aria-labelledby="achievement-highlight-heading"
    >
      <div className="container mx-auto">
        {/* ── Section header ── */}
        <div
          className="mb-8 sm:mb-12"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] mb-5">
            <span
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: "var(--color-primary-light)" }}
            >
              Honors &amp; Awards
            </span>
          </div>

          <h2
            id="achievement-highlight-heading"
            className="text-[28px] sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight"
          >
            My{" "}
            <span style={{ color: "var(--color-primary-light)" }}>
              Achievements
            </span>
          </h2>
          <p
            className="mt-2 text-sm sm:text-base"
            style={{ color: "var(--color-text-muted)" }}
          >
            Milestones, competitive awards, and honors I&apos;ve received along
            my journey.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(0,1fr)] gap-5 p-0 m-0 list-none animate-cards-in">
          {highlighted.map((item, index) => {
            const bgColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
            const gridClasses = getGridClasses(index, total)
            const isLarge =
              gridClasses.includes("col-span-2") ||
              gridClasses.includes("col-span-3")
            const titleId = `achievement-${item.id}-title`

            return (
              <li
                key={item.id}
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay={index * 100}
                className={`relative group min-w-0 w-full list-none ${gridClasses}`}
              >
                <article
                  aria-labelledby={titleId}
                  className={`relative z-10 h-full rounded-xl border-2 border-white/10 bg-white/5 flex flex-col shadow-[6px_6px_0_rgba(255,255,255,0.15)] group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-hover:shadow-none group-hover:border-white/30 transition-all duration-200 cursor-target ${
                    isLarge
                      ? "p-5 sm:p-6 lg:p-8 gap-4 lg:gap-6"
                      : "p-5 sm:p-6 gap-4"
                  }`}
                >
                  {/* Overlay warna dinamis (selaras StatCard) */}
                  <div
                    className="absolute -z-10 inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary-light))",
                    }}
                  />

                  {/* Baris atas: trophy + nomor */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`rounded-xl flex items-center justify-center shrink-0 text-white shadow-md ${
                        isLarge ? "w-10 h-10 lg:w-14 lg:h-14" : "w-10 h-10"
                      }`}
                      style={{ background: bgColor }}
                      aria-hidden="true"
                    >
                      <Trophy
                        className={isLarge ? "w-6 h-6 lg:w-8 lg:h-8" : "w-5 h-5"}
                      />
                    </div>
                    <span
                      className={`font-mono font-semibold tabular-nums opacity-40 ${
                        isLarge ? "text-xs lg:text-base" : "text-xs"
                      }`}
                      style={{ color: "var(--color-primary-light)" }}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Judul, level, deskripsi */}
                  <div className="space-y-2">
                    <h3
                      id={titleId}
                      className={`font-bold text-white leading-snug ${
                        isLarge
                          ? "text-base sm:text-xl lg:text-2xl"
                          : "text-base sm:text-xl"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`font-medium ${isLarge ? "text-base" : "text-xs"}`}
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {item.level_competition}
                    </p>
                    {item.deskripsi && (
                      <p
                        className={`italic border-l-2 pl-3 leading-relaxed ${isLarge ? "text-base" : "text-xs"}`}
                        style={{
                          color: "var(--color-text-muted)",
                          borderColor: "var(--color-primary-light)",
                        }}
                      >
                        &ldquo;{item.deskripsi}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Baris bawah: place/badge + tanggal */}
                  <div
                    className={`mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] ${
                      isLarge ? "pt-4" : "pt-3"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center justify-center text-xs font-medium rounded-md bg-white/10 text-white px-3 py-1">
                        {item.place}
                      </span>
                      {item.badge_text && (
                        <span
                          className="inline-flex items-center justify-center text-xs font-semibold rounded-md border border-white/15 px-3 py-1"
                          style={{ color: "var(--color-primary-light)" }}
                        >
                          {item.badge_text}
                        </span>
                      )}
                    </div>

                    <span
                      className="text-xs font-medium whitespace-nowrap"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.date}
                    </span>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
