import React, { useState, useEffect, useRef } from "react"
import { useExperienceData } from "./hooks/useExperienceData"
import { MapPin, CalendarDays, Sparkles, ChevronDown } from "lucide-react"
import { formatDateRange as formatWorkDate } from "@/utils/workExperiences"
import { formatDateRange as formatEduDate } from "@/utils/educations"
import { Badge } from "@/components/ui/badge"
import renderDescription from "@/utils/renderDescription"

/* ──────────────────────────────────────────────────────────────
   Sistem spacing & tipografi: kelipatan 4px (4/8/12/16/24/32/48/80).
   Tipografi: 12 (meta) · 16 (body) · 24–28 (judul) · 36–48 (H1).
   ────────────────────────────────────────────────────────────── */

/* ── Kartu entri (pengalaman / pendidikan) — expandable ── */
const ExpandableCard = ({
  id,
  title,
  subtitle,
  dateRange,
  location,
  badges,
  description,
  isCurrent,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 176) {
      setIsTruncated(true)
    }
  }, [description])

  return (
    <li className="relative group list-none">
      <div
        className="absolute -inset-1 bg-[#0f172a] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"
        aria-hidden="true"
      />
      <article
        aria-labelledby={id}
        className="relative h-full flex flex-col rounded-3xl border-2 border-white/10 bg-[#0f172a]/80 text-[color:var(--color-text-primary)] backdrop-blur-md p-6 sm:p-8 shadow-[6px_6px_0_var(--color-shadow-primary)] group-hover:border-white/20 transition-all duration-500"
      >
        {/* Header: judul + badge · subjudul + meta · tanggal/lokasi */}
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id={id}
                className="text-2xl lg:text-[28px] font-bold text-white leading-tight"
              >
                {title}
              </h2>
              {isCurrent && (
                <Badge
                  variant="primary"
                  className="text-xs uppercase tracking-wider px-3 py-1 font-semibold"
                >
                  Current
                </Badge>
              )}
            </div>

            <p className="flex flex-wrap items-center gap-2 text-base">
              <span className="font-semibold text-white">{subtitle}</span>
              {badges &&
                badges.filter(Boolean).map((badge, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-gray-600" aria-hidden="true">
                      ·
                    </span>
                    <Badge
                      variant="neutral"
                      className="text-xs uppercase tracking-widest px-2 py-1 font-medium bg-white/5 text-gray-300"
                    >
                      {badge}
                    </Badge>
                  </React.Fragment>
                ))}
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <span className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <CalendarDays
                className="w-4 h-4 text-theme-primary-light"
                aria-hidden="true"
              />
              {dateRange}
            </span>

            {location && (
              <span className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <MapPin
                  className="w-4 h-4 text-theme-primary-light"
                  aria-hidden="true"
                />
                {location}
              </span>
            )}
          </div>
        </header>

        {/* Deskripsi (expandable) */}
        {description && (
          <div className="mt-6 relative">
            <div
              ref={contentRef}
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpanded ? "max-h-[2000px]" : "max-h-40"
              }`}
            >
              {renderDescription(description)}

              {!isExpanded && isTruncated && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/60 to-transparent pointer-events-none" />
              )}
            </div>

            {isTruncated && (
              <div
                className={`mt-2 flex ${!isExpanded ? "relative z-10 -mt-8" : ""}`}
              >
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-expanded={isExpanded}
                  className="cursor-target group/btn flex items-center gap-2 text-xs font-medium text-theme-primary-light hover:text-white transition-colors duration-300 py-2 focus:outline-none no-neo"
                >
                  <span className="relative overflow-hidden pb-1">
                    {isExpanded ? "Show less" : "Read more"}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-theme-primary-light transform origin-left scale-x-0 transition-transform duration-300 group-hover/btn:scale-x-100" />
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </div>
        )}

        {children}
      </article>
    </li>
  )
}

/* ── Skeleton loader ── */
const SkeletonCard = () => (
  <div className="rounded-3xl border-2 border-white/10 bg-white/5 p-6 sm:p-8 animate-pulse min-h-72" />
)

/* ── Empty state ── */
const EmptyState = ({ children }) => (
  <div className="text-center py-20 text-base text-gray-400">{children}</div>
)

/* ── Main Component ── */
export default function ExperienceContent() {
  const [activeTab, setActiveTab] = useState("work")
  const { workExperiences, educations, loading } = useExperienceData()

  const TABS = [
    { id: "work", label: "Working Experience", number: "01" },
    { id: "education", label: "Educational History", number: "02" },
  ]

  return (
    <section
      className="pb-24 px-[5%] md:px-[10%] min-h-screen"
      aria-labelledby="journey-heading"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* ── Left: Sidebar navigasi ── */}
        <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit lg:z-30">
          <div className="mb-8 lg:mb-12">
            <h1
              id="journey-heading"
              className="text-4xl md:text-5xl font-display font-bold text-white leading-tight"
            >
              Professional{" "}
              <span className="text-theme-primary-light">Journey</span>
            </h1>
          </div>

          <div
            role="tablist"
            aria-label="Experience sections"
            className="sticky top-[76px] lg:relative lg:top-0 z-30 flex flex-row lg:flex-col gap-3 bg-white/5 border border-white/10 rounded-3xl p-3 sm:p-6 backdrop-blur-xl"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-target w-full flex items-center justify-center lg:justify-start gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl transition-all duration-300 font-medium text-center lg:text-left no-neo ${
                    isActive
                      ? "bg-theme-primary text-white shadow-xl shadow-theme-primary/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white shadow-none"
                  }`}
                >
                  <span
                    className={`text-xs font-bold tabular-nums ${isActive ? "text-white" : "text-gray-500"}`}
                  >
                    {tab.number}
                  </span>
                  <span className="text-base">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right: Konten ── */}
        <div className="lg:w-2/3 flex flex-col">
          {loading ? (
            <div className="space-y-8" aria-hidden="true">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              tabIndex={0}
              className="focus:outline-none"
            >
              {activeTab === "work" ? (
                workExperiences.length > 0 ? (
                  <ol className="space-y-8 list-none p-0 m-0">
                    {workExperiences.map((exp) => {
                      const techStack = Array.isArray(exp.tech_stack)
                        ? exp.tech_stack
                        : []
                      return (
                        <ExpandableCard
                          key={exp.id}
                          id={`work-${exp.id}`}
                          title={exp.position}
                          subtitle={exp.company}
                          dateRange={formatWorkDate(
                            exp.start_month,
                            exp.start_year,
                            exp.end_month,
                            exp.end_year,
                            exp.is_current
                          )}
                          location={exp.location}
                          badges={[exp.employment_type]}
                          description={exp.description}
                          isCurrent={exp.is_current}
                        >
                          {techStack.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                              <ul
                                className="flex flex-wrap gap-2"
                                aria-label="Tech stack"
                              >
                                {techStack.map((tech) => (
                                  <li key={tech}>
                                    <Badge
                                      variant="neutral"
                                      className="text-xs font-medium bg-white/5 hover:bg-theme-primary/20 hover:text-theme-primary-light border-white/10 hover:border-theme-primary/30 transition-all duration-300 px-3 py-1"
                                    >
                                      {tech}
                                    </Badge>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </ExpandableCard>
                      )
                    })}
                  </ol>
                ) : (
                  <EmptyState>No working experience found.</EmptyState>
                )
              ) : educations.length > 0 ? (
                <ol className="space-y-8 list-none p-0 m-0">
                  {educations.map((edu) => (
                    <ExpandableCard
                      key={edu.id}
                      id={`edu-${edu.id}`}
                      title={edu.school}
                      subtitle={`${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ""}`}
                      dateRange={formatEduDate(
                        edu.start_month,
                        edu.start_year,
                        edu.end_month,
                        edu.end_year,
                        edu.is_current
                      )}
                      badges={edu.grade ? [`Grade: ${edu.grade}`] : null}
                      description={edu.description}
                      isCurrent={edu.is_current}
                    >
                      {edu.activities && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                          <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                            <Sparkles
                              className="w-4 h-4 text-theme-primary-light"
                              aria-hidden="true"
                            />
                            Activities &amp; Societies
                          </h3>
                          <div className="text-base text-gray-300 leading-relaxed">
                            {renderDescription(edu.activities)}
                          </div>
                        </div>
                      )}
                    </ExpandableCard>
                  ))}
                </ol>
              ) : (
                <EmptyState>No educational history found.</EmptyState>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
