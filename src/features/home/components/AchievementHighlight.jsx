import { useEffect } from "react"
import { useAchievementStore } from "../../../store/useAchievementStore"
import { Trophy } from "lucide-react"
// Gunakan gradien warna serupa dengan avatar perusahaan di ExperienceHighlight
const AVATAR_COLORS = [
  "linear-gradient(135deg, #6366f1, #818cf8)",
  "linear-gradient(135deg, #3b82f6, #60a5fa)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #06b6d4, #22d3ee)",
  "linear-gradient(135deg, #10b981, #34d399)",
]

export default function AchievementHighlight() {
  const { achievements, fetchAchievements, loading } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500">
        Loading achievements...
      </div>
    )
  }

  const highlighted = achievements ? achievements.slice(0, 5) : []
  const total = highlighted.length

  if (total === 0 && !loading) return null

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
      if (index === 1) return "col-span-1 lg:col-span-1 lg:row-span-1"
      if (index === 2) return "col-span-1 lg:col-span-1 lg:row-span-1"
      if (index === 3) return "md:col-span-2 lg:col-span-2 lg:row-span-1"
    }
    if (totalItems === 5) {
      if (index === 0) return "md:col-span-2 lg:col-span-2 lg:row-span-2"
      if (index === 1) return "col-span-1 lg:col-span-1 lg:row-span-1"
      if (index === 2) return "col-span-1 lg:col-span-1 lg:row-span-1"
      if (index === 3) return "md:col-span-2 lg:col-span-2 lg:row-span-1"
      if (index === 4) return "col-span-1 lg:col-span-1 lg:row-span-1"
    }
    return index === 0
      ? "md:col-span-2 lg:col-span-2 lg:row-span-2"
      : "col-span-1 lg:col-span-1 lg:row-span-1"
  }

  return (
    <section
      id="AchievementHighlight"
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-20 sm:py-24"
      style={{ backgroundColor: "var(--color-backdrop-base)" }}
    >
      <div className="container mx-auto">
        {/* ── Section header ── */}
        <div
          className="mb-10 sm:mb-12"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          {/* Small badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] mb-5">
            <span
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: "var(--color-primary-light)" }}
            >
              Honors & Awards
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                My{" "}
                <span style={{ color: "var(--color-primary-light)" }}>
                  Achievements
                </span>
              </h2>
              <p
                className="mt-2 text-sm sm:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                Milestones, competitive awards, and honors I've received along
                my journey.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bento Grid Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(0,1fr)] gap-5 animate-cards-in">
          {highlighted.map((item, index) => {
            const bgColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
            const bgNumber = index + 1

            // Tentukan posisi grid responsif
            const gridClasses = getGridClasses(index, total)
            const isLarge =
              gridClasses.includes("col-span-2") ||
              gridClasses.includes("col-span-3")

            return (
              <div
                key={item.id}
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay={index * 100}
                className={`relative group flex-1 min-w-0 w-full ${gridClasses}`}
              >
                <div
                  className={`relative z-10 h-full rounded-xl border-2 border-white/10 bg-white/5 flex flex-col shadow-[6px_6px_0_rgba(255,255,255,0.15)] group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-hover:shadow-none group-hover:border-white/30 transition-all duration-200 cursor-target ${isLarge ? "p-5 sm:p-6 lg:p-8 gap-4 lg:gap-6" : "p-5 sm:p-6 gap-4"}`}
                >
                  {/* Dynamic color overlay matching StatCard */}
                  <div
                    className="absolute -z-10 inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary-light))",
                    }}
                  ></div>

                  {/* Top row: avatar + number */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-md transition-all ${
                        isLarge
                          ? "w-10 h-10 lg:w-14 lg:h-14 text-base lg:text-xl"
                          : "w-10 h-10 text-base"
                      }`}
                      style={{ background: bgColor }}
                      aria-hidden="true"
                    >
                      <Trophy
                        className={
                          isLarge ? "w-6 h-6 lg:w-8 lg:h-8" : "w-5 h-5"
                        }
                      />
                    </div>
                    <span
                      className={`font-mono font-semibold tabular-nums opacity-40 ${
                        isLarge ? "text-sm lg:text-lg" : "text-sm"
                      }`}
                      style={{ color: "var(--color-primary-light)" }}
                    >
                      {String(bgNumber).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title & Level */}
                  <div className="space-y-1 flex-1 flex flex-col justify-center mt-2 lg:mt-0">
                    <h3
                      className={`font-bold text-white leading-snug ${
                        isLarge
                          ? "text-base sm:text-lg lg:text-2xl"
                          : "text-base sm:text-lg"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`font-medium ${isLarge ? "text-sm lg:text-base mt-1" : "text-sm"}`}
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {item.level_competition}
                    </p>
                    {item.deskripsi && (
                      <p
                        className="text-xs lg:text-sm mt-2 italic border-l-2 pl-3"
                        style={{
                          color: "var(--color-text-muted)",
                          borderColor: "var(--color-primary-light)",
                        }}
                      >
                        "{item.deskripsi}"
                      </p>
                    )}
                  </div>

                  {/* Bottom row: badge/place + date */}
                  <div
                    className={`flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] ${
                      isLarge ? "pt-4 mt-auto" : "pt-3 mt-auto"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={`inline-flex items-center justify-center font-medium rounded-md bg-white/10 text-white ${
                          isLarge
                            ? "text-[11px] lg:text-xs px-2.5 lg:px-3 py-0.5 lg:py-1"
                            : "text-[11px] px-2.5 py-0.5"
                        }`}
                      >
                        {item.place}
                      </div>
                      {item.badge_text && (
                        <div
                          className={`inline-flex items-center justify-center font-semibold rounded-md border border-white/15 bg-transparent ${
                            isLarge
                              ? "text-[11px] lg:text-xs px-2.5 lg:px-3 py-0.5 lg:py-1"
                              : "text-[11px] px-2.5 py-0.5"
                          }`}
                          style={{ color: "var(--color-primary-light)" }}
                        >
                          {item.badge_text}
                        </div>
                      )}
                    </div>

                    <span
                      className={`font-medium whitespace-nowrap ${isLarge ? "text-xs lg:text-sm" : "text-xs"}`}
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
