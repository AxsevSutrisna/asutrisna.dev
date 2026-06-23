import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase } from 'lucide-react'
import { useExperienceData } from '../../experience/hooks/useExperienceData'
import { formatDateRange } from '../../../utils/workExperiences'
import { Badge } from '@/components/ui/badge'

/* ─── Avatar inisial perusahaan ───────────────────────────────── */
const AVATAR_COLORS = [
  'linear-gradient(135deg, #6366f1, #818cf8)',
  'linear-gradient(135deg, #3b82f6, #60a5fa)',
  'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  'linear-gradient(135deg, #06b6d4, #22d3ee)',
  'linear-gradient(135deg, #10b981, #34d399)',
]

const CompanyAvatar = ({ name, index, isLarge }) => {
  const initial = (name || '?')[0].toUpperCase()
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-md transition-all ${
        isLarge ? 'w-10 h-10 lg:w-14 lg:h-14 text-base lg:text-xl' : 'w-10 h-10 text-base'
      }`}
      style={{ background: bg }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}

/* ─── Kartu pengalaman individual ─────────────────────────────── */
const ExperienceCard = memo(({ experience, index }) => {
  const dateRange = formatDateRange(
    experience.start_month,
    experience.start_year,
    experience.end_month,
    experience.end_year,
    experience.is_current,
  )

  const isLarge = index === 0

  return (
    <div
      className={`relative group flex-1 min-w-0 card-fade-up ${
        isLarge ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : 'col-span-1'
      }`}
      style={{ '--delay': `${index * 100}ms` }}
    >
      {/* Background card selaras dengan StatCard */}
      <div className={`relative z-10 h-full rounded-xl border-2 border-white/10 bg-white/5 flex flex-col shadow-[6px_6px_0_rgba(255,255,255,0.15)] group-hover:translate-x-[6px] group-hover:translate-y-[6px] group-hover:shadow-none group-hover:border-white/30 transition-all duration-200 ${
        isLarge ? 'p-5 sm:p-6 lg:p-8 gap-4 lg:gap-6' : 'p-5 sm:p-6 gap-4'
      }`}>
        
        {/* Dynamic color overlay matching StatCard */}
        <div 
          className="absolute -z-10 inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" 
          style={{ background: 'linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary-light))' }}
        ></div>

        {/* Top row: avatar + number */}
        <div className="flex items-start justify-between">
          <CompanyAvatar name={experience.company} index={index} isLarge={isLarge} />
          <span
            className={`font-mono font-semibold tabular-nums opacity-40 ${
              isLarge ? 'text-sm lg:text-lg' : 'text-sm'
            }`}
            style={{ color: 'var(--color-primary-light)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Position & company */}
        <div className="space-y-1 flex-1 flex flex-col justify-center">
          <h3 className={`font-bold text-white leading-snug ${
            isLarge ? 'text-base sm:text-lg lg:text-2xl' : 'text-base sm:text-lg'
          }`}>
            {experience.position}
          </h3>
          <p className={`font-medium ${isLarge ? 'text-sm lg:text-base mt-1' : 'text-sm'}`} style={{ color: 'var(--color-text-secondary)' }}>
            {experience.company}
          </p>
          {experience.department && (
            <p className="text-xs lg:text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {experience.department}
            </p>
          )}
        </div>

        {/* Bottom row: employment type + date */}
        <div className={`flex flex-wrap items-center gap-2 border-t border-white/[0.06] ${
          isLarge ? 'pt-2 lg:pt-4' : 'pt-2'
        }`}>
          <Badge
            variant="neutral"
            className={`font-medium rounded-md ${
              isLarge ? 'text-[11px] lg:text-xs px-2.5 lg:px-3 py-0.5 lg:py-1' : 'text-[11px] px-2.5 py-0.5'
            }`}
          >
            {experience.employment_type || 'Fulltime'}
          </Badge>
          <span
            className={`font-medium ${isLarge ? 'text-xs lg:text-sm' : 'text-xs'}`}
            style={{ color: 'var(--color-primary-light)' }}
          >
            {dateRange}
          </span>
        </div>
      </div>
    </div>
  )
})
ExperienceCard.displayName = 'ExperienceCard'

/* ─── Skeleton loader ─────────────────────────────────────────── */
const SkeletonCard = ({ isLarge }) => (
  <div className={`flex-1 min-w-0 rounded-xl border-2 border-white/10 bg-white/5 p-5 sm:p-6 animate-pulse ${
    isLarge ? 'md:col-span-2 lg:col-span-2 lg:row-span-2 h-48 lg:h-auto' : 'col-span-1 h-48'
  }`} />
)

/* ─── ExperienceHighlight ──────────────────────────────────────── */
const ExperienceHighlight = () => {
  const { workExperiences, loading } = useExperienceData()

  const highlighted = useMemo(
    () => workExperiences.slice(0, 3),
    [workExperiences]
  )

  const hasData = highlighted.length > 0

  return (
    <section
      id="ExperienceHighlight"
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-20 sm:py-24"
      style={{ backgroundColor: 'var(--color-backdrop-base)' }}
      aria-label="Work Experience Highlight"
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
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-primary-light)' }}>
              Working Experience
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                Where I&apos;ve{' '}
                <span style={{ color: 'var(--color-primary-light)' }}>Worked</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--color-text-muted)' }}>
                Recent roles shaping my expertise.
              </p>
            </div>

            {workExperiences.length > 0 && (
              <Link
                to="/experience"
                className="inline-flex items-center gap-1.5 text-sm font-medium shrink-0 transition-opacity hover:opacity-70 whitespace-nowrap"
                style={{ color: 'var(--color-primary-light)' }}
              >
                View all experience
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* ── Bento Grid Cards ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-5">
            <SkeletonCard isLarge={true} />
            <SkeletonCard isLarge={false} />
            <SkeletonCard isLarge={false} />
          </div>
        ) : hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-5 animate-cards-in">
            {highlighted.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 rounded-2xl border border-white/10 bg-[#0b0b18]">
            <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No experience data available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

ExperienceHighlight.displayName = 'ExperienceHighlight'
export default memo(ExperienceHighlight)
