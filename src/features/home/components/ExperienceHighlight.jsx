import { memo, useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Briefcase } from "lucide-react"
import { useExperienceData } from "@/features/experience/hooks/useExperienceData"
import { formatDateRange } from "@/utils/workExperiences"
import { Badge } from "@/components/ui/badge"

/* ─── Avatar inisial perusahaan ───────────────────────────────── */
const AVATAR_COLORS = [
  "linear-gradient(135deg, #6366f1, #818cf8)",
  "linear-gradient(135deg, #3b82f6, #60a5fa)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #06b6d4, #22d3ee)",
  "linear-gradient(135deg, #10b981, #34d399)",
]

const CompanyAvatar = ({ name, index, isLarge }) => {
  const initial = (name || "?")[0].toUpperCase()
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-md transition-all ${
        isLarge
          ? "w-11 h-11 lg:w-14 lg:h-14 text-lg lg:text-xl"
          : "w-10 h-10 text-base"
      }`}
      style={{ background: bg }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}

/* ─── Chip tech stack (sebagai list, baik untuk SEO) ───────────── */
const TechChips = ({ items, max }) => {
  if (!Array.isArray(items) || items.length === 0) return null
  const shown = items.slice(0, max)
  const rest = items.length - shown.length
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
      {shown.map((tech) => (
        <li
          key={tech}
          className="text-xs font-medium px-2 py-1 rounded-md border border-white/10 bg-white/[0.04]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {tech}
        </li>
      ))}
      {rest > 0 && (
        <li className="text-xs font-medium px-2 py-1 rounded-md border border-white/10 text-gray-500">
          +{rest} more
        </li>
      )}
    </ul>
  )
}

/* Rapikan deskripsi (buang penanda bullet) menjadi ringkasan satu paragraf. */
const cleanSummary = (text) =>
  String(text || "")
    .split("\n")
    .map((line) => line.replace(/^[-•–]\s*/, "").trim())
    .filter(Boolean)
    .join(" ")

/* Penempatan bento untuk 4 kartu (lg: grid 4×2). */
const CARD_SPANS = [
  "md:col-span-2 lg:col-span-2 lg:row-span-2", // 0 — featured (besar)
  "md:col-span-2 lg:col-span-2 lg:col-start-3 lg:row-start-1", // 1 — wide
  "md:col-span-1 lg:col-start-3 lg:row-start-2", // 2 — small
  "md:col-span-1 lg:col-start-4 lg:row-start-2", // 3 — small
]

/* ─── Kartu pengalaman individual ─────────────────────────────── */
const ExperienceCard = memo(({ experience, index }) => {
  const dateRange = formatDateRange(
    experience.start_month,
    experience.start_year,
    experience.end_month,
    experience.end_year,
    experience.is_current
  )

  const isFeatured = index === 0
  const isWide = index === 1
  const techStack = Array.isArray(experience.tech_stack)
    ? experience.tech_stack
    : []
  const summary = cleanSummary(experience.description)
  const showSummary = (isFeatured || isWide) && summary
  const chipMax = isFeatured ? 10 : isWide ? 6 : 4
  const titleId = `experience-${experience.id}-title`
  const spanClass = CARD_SPANS[index] || "col-span-1"

  return (
    <li
      className={`relative group min-w-0 card-fade-up cursor-target list-none ${spanClass}`}
      style={{ "--delay": `${index * 100}ms` }}
    >
      <article
        aria-labelledby={titleId}
        className={`relative z-10 h-full rounded-xl border-2 border-white/10 bg-white/5 flex flex-col shadow-[6px_6px_0_rgba(255,255,255,0.15)] group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-hover:shadow-none group-hover:border-white/30 transition-all duration-200 ${
          isFeatured ? "p-5 sm:p-6 lg:p-8 gap-4 lg:gap-5" : "p-5 gap-3"
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

        {/* Baris atas: avatar (+ badge current) & nomor urut */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CompanyAvatar
              name={experience.company}
              index={index}
              isLarge={isFeatured}
            />
            {experience.is_current && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Current
              </span>
            )}
          </div>
          <span
            className={`font-mono font-semibold tabular-nums opacity-40 ${
              isFeatured ? "text-xs lg:text-base" : "text-xs"
            }`}
            style={{ color: "var(--color-primary-light)" }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Posisi & perusahaan */}
        <header className="space-y-1">
          <h3
            id={titleId}
            className={`font-bold text-white leading-snug ${
              isFeatured
                ? "text-base sm:text-xl lg:text-2xl"
                : "text-base sm:text-xl"
            }`}
          >
            {experience.position}
          </h3>
          <p
            className={`font-medium ${isFeatured ? "text-base" : "text-xs"}`}
            style={{ color: "var(--color-text-secondary)" }}
          >
            {experience.company}
            {experience.location ? (
              <span style={{ color: "var(--color-text-muted)" }}>
                {" · "}
                {experience.location}
              </span>
            ) : null}
          </p>
        </header>

        {/* Deskripsi (featured & wide) untuk mengisi ruang + konten SEO */}
        {showSummary ? (
          <p
            className={`leading-relaxed ${isFeatured ? "text-base line-clamp-3 lg:line-clamp-4" : "text-xs line-clamp-2"}`}
            style={{ color: "var(--color-text-muted)" }}
          >
            {summary}
          </p>
        ) : null}

        {/* Tech stack */}
        {techStack.length > 0 && <TechChips items={techStack} max={chipMax} />}

        {/* Meta bawah: tipe kerja + rentang tanggal (selalu menempel bawah) */}
        <div
          className={`mt-auto flex flex-wrap items-center gap-2 border-t border-white/[0.06] ${
            isFeatured ? "pt-3 lg:pt-4" : "pt-3"
          }`}
        >
          <Badge
            variant="neutral"
            className="font-medium rounded-md text-xs px-3 py-1"
          >
            {experience.employment_type || "Fulltime"}
          </Badge>
          <span
            className="font-medium text-xs"
            style={{ color: "var(--color-primary-light)" }}
          >
            {dateRange}
          </span>
        </div>
      </article>
    </li>
  )
})
ExperienceCard.displayName = "ExperienceCard"

/* ─── Skeleton loader ─────────────────────────────────────────── */
const SkeletonCard = ({ spanClass, large }) => (
  <div
    className={`min-w-0 rounded-xl border-2 border-white/10 bg-white/5 p-5 animate-pulse ${spanClass} ${
      large ? "min-h-[320px] lg:min-h-0" : "min-h-[200px] lg:min-h-0"
    }`}
  />
)

/* ─── ExperienceHighlight ──────────────────────────────────────── */
const ExperienceHighlight = () => {
  const { workExperiences, loading } = useExperienceData()

  const highlighted = useMemo(
    () => workExperiences.slice(0, 4),
    [workExperiences]
  )

  const hasData = highlighted.length > 0

  return (
    <section
      id="ExperienceHighlight"
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-14 sm:py-20 lg:py-24"
      style={{ backgroundColor: "var(--color-backdrop-base)" }}
      aria-labelledby="experience-highlight-heading"
    >
      <div className="container mx-auto">
        {/* ── Section header ── */}
        <div
          className="mb-8 sm:mb-12"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          {/* Small badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] mb-5">
            <span
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: "var(--color-primary-light)" }}
            >
              Working Experience
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2
                id="experience-highlight-heading"
                className="text-[28px] sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight"
              >
                Where I&apos;ve{" "}
                <span style={{ color: "var(--color-primary-light)" }}>
                  Worked
                </span>
              </h2>
              <p
                className="mt-2 text-sm sm:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                Recent roles shaping my expertise.
              </p>
            </div>

            {workExperiences.length > 0 && (
              <Link
                to="/experience"
                className="group inline-flex items-center gap-1.5 text-sm font-medium shrink-0 whitespace-nowrap cursor-target"
                style={{ color: "var(--color-primary-light)" }}
                aria-label="View all work experience"
              >
                <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 group-hover:after:w-full after:transition-all after:duration-300 after:h-[1.5px] after:bg-current">
                  View all experience
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>

        {/* ── Bento Grid Cards (1 besar + 1 lebar + 2 kecil = 4) ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5">
            {CARD_SPANS.map((span, i) => (
              <SkeletonCard key={i} spanClass={span} large={i === 0} />
            ))}
          </div>
        ) : hasData ? (
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5 p-0 m-0 list-none animate-cards-in">
            {highlighted.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} index={index} />
            ))}
          </ol>
        ) : (
          <div className="text-center py-14 rounded-2xl border border-white/10 bg-[#0b0b18]">
            <Briefcase
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              No experience data available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

ExperienceHighlight.displayName = "ExperienceHighlight"
export default memo(ExperienceHighlight)
