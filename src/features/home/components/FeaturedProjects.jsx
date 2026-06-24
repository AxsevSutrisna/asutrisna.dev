import { memo, useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FolderOpen, ExternalLink } from 'lucide-react'
import { useProjects } from '../../projects/hooks/useProjects'
import { toSlug } from '../../../utils/slug'

/* ─── Config ────────────────────────────────────────────────────── */
const CARD_WIDTH_DESKTOP = 300   // px
const CARD_WIDTH_MOBILE  = 256   // px
const CARD_GAP           = 20    // px
const SCROLL_SPEED       = 55    // px / second (forward & backward)
const PAUSE_AT_END_MS    = 1800  // pause when last card reached
const PAUSE_AT_START_MS  = 900   // pause before scrolling forward again
const START_DELAY_MS     = 600   // initial delay before first scroll

/* ─── Helper: parse categories ──────────────────────────────────── */
const getCategories = (project) => {
  const raw = project.category || project.Category || ''
  if (!raw) return []
  return raw.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
}

/* ─── ProjectCard ───────────────────────────────────────────────── */
const ProjectCard = memo(({ project, cardWidth }) => {
  const title       = project.title       || project.Title       || ''
  const description = project.description || project.Description || ''
  const img         = project.img         || project.Img
  const link        = project.link        || project.Link
  const categories  = getCategories(project)
  const slug        = toSlug(title)

  return (
    <article
      className="group relative shrink-0 flex flex-col"
      style={{ width: cardWidth, height: 420 }}
      aria-label={title}
    >
      <div className="relative flex flex-col h-full rounded-[18px] border-2 border-white/10 bg-[#0b0b18] overflow-hidden shadow-[5px_5px_0_rgba(255,255,255,0.06)] group-hover:translate-x-[-3px] group-hover:translate-y-[-3px] group-hover:shadow-[8px_8px_0_rgba(99,102,241,0.2)] group-hover:border-white/25 transition-all duration-200">

        {/* Thumbnail */}
        <div className="relative shrink-0 overflow-hidden" style={{ height: 200 }}>
          {img ? (
            <img
              src={img}
              alt={`Screenshot of ${title}`}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/[0.03]">
              <FolderOpen className="w-10 h-10 opacity-15 text-white" />
            </div>
          )}

          {/* Fade gradient into card body */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0b0b18 0%, transparent 100%)' }}
          />

          {/* External link hover badge */}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${title} live`}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 pb-4 pt-3 gap-2 min-h-0">

          {/* Category tags */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {categories.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-white/10 bg-white/[0.04]"
                  style={{ color: 'var(--color-primary-light)' }}
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Title — fixed 2-line slot */}
          <h3
            className="text-sm font-bold text-white leading-snug line-clamp-2 shrink-0"
            style={{ minHeight: '2.6em' }}
          >
            {title}
          </h3>

          {/* Description — flex-1 clamped */}
          <p
            className="text-xs leading-relaxed line-clamp-3 flex-1 overflow-hidden"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description || 'No description available.'}
          </p>

          {/* Footer: Details link */}
          <div className="shrink-0 pt-1 border-t border-white/[0.06]">
            {slug ? (
              <Link
                to={`/project/${slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150 hover:gap-2.5"
                style={{ color: 'var(--color-primary-light)' }}
                aria-label={`View details for ${title}`}
              >
                Details
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Details unavailable
              </span>
            )}
          </div>
        </div>

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))' }}
        />
      </div>
    </article>
  )
})
ProjectCard.displayName = 'ProjectCard'

/* ─── Skeleton card ─────────────────────────────────────────────── */
const SkeletonCard = ({ cardWidth }) => (
  <div
    className="shrink-0 rounded-[18px] border-2 border-white/10 bg-white/[0.03] animate-pulse"
    style={{ width: cardWidth, height: 420 }}
  />
)

/* ─── FeaturedProjects ──────────────────────────────────────────── */
const FeaturedProjects = () => {
  const { projects, loading } = useProjects()

  const containerRef  = useRef(null)
  const trackRef      = useRef(null)
  const isHoveredRef  = useRef(false)    // use ref — avoid stale closure in RAF

  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP)

  // Show max 6 projects
  const featured = useMemo(() => projects.slice(0, 6), [projects])

  /* ── Responsive card width ── */
  useEffect(() => {
    const update = () =>
      setCardWidth(window.innerWidth < 640 ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  /* ── Compute max scroll offset from DOM ── */
  const getMaxOffset = useCallback(() => {
    const c = containerRef.current
    const t = trackRef.current
    if (!c || !t) return 0
    return Math.max(0, t.scrollWidth - c.clientWidth)
  }, [])

  /* ── Auto-scroll: forward → pause → backward → pause → repeat ── */
  useEffect(() => {
    if (loading || featured.length === 0) return

    let animId     = null
    let lastTs     = null
    let offset     = 0
    let phase      = 'forward'   // 'forward' | 'return'
    let paused     = false
    let pauseTimer = null

    /* Apply CSS transform to track */
    const applyOffset = (px) => {
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-px}px, 0, 0)`
      }
    }

    /* Schedule a pause then resume animation in next phase */
    const scheduleResume = (delayMs, nextPhase) => {
      paused = true
      pauseTimer = setTimeout(() => {
        paused     = false
        phase      = nextPhase
        lastTs     = null          // reset dt calculation
        animId     = requestAnimationFrame(tick)
      }, delayMs)
    }

    const tick = (timestamp) => {
      // Initialise timestamp on first call or after pause
      if (lastTs === null) lastTs = timestamp
      const dt = Math.min((timestamp - lastTs) / 1000, 0.05)  // cap at 50ms
      lastTs = timestamp

      /* While hovered OR in pause — keep RAF alive but don't move */
      if (paused || isHoveredRef.current) {
        animId = requestAnimationFrame(tick)
        return
      }

      const maxOff = getMaxOffset()

      if (phase === 'forward') {
        offset = Math.min(offset + SCROLL_SPEED * dt, maxOff)
        applyOffset(offset)

        if (offset >= maxOff) {
          /* Reached last card — stop RAF, schedule pause then return */
          cancelAnimationFrame(animId)
          animId = null
          scheduleResume(PAUSE_AT_END_MS, 'return')
          return
        }
      } else {
        /* return phase — scroll backwards */
        offset = Math.max(offset - SCROLL_SPEED * dt, 0)
        applyOffset(offset)

        if (offset <= 0) {
          /* Back at start — stop RAF, schedule pause then go forward again */
          cancelAnimationFrame(animId)
          animId = null
          scheduleResume(PAUSE_AT_START_MS, 'forward')
          return
        }
      }

      animId = requestAnimationFrame(tick)
    }

    /* Small delay before first scroll so layout is fully measured */
    pauseTimer = setTimeout(() => {
      animId = requestAnimationFrame(tick)
    }, START_DELAY_MS)

    return () => {
      if (animId)     cancelAnimationFrame(animId)
      if (pauseTimer) clearTimeout(pauseTimer)
    }
  }, [loading, featured, getMaxOffset])

  /* ── Empty state ── */
  if (!loading && featured.length === 0) {
    return (
      <section
        id="FeaturedProjects"
        className="w-full py-20 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-[10%]"
        style={{ backgroundColor: 'var(--color-backdrop-base)' }}
      >
        <div className="container mx-auto text-center py-16 rounded-2xl border border-white/10 bg-white/5">
          <FolderOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No projects to display yet.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="FeaturedProjects"
      className="w-full py-20 sm:py-24"
      style={{ backgroundColor: 'var(--color-backdrop-base)' }}
      aria-label="Featured Projects"
    >
      {/* ── Section Header ── */}
      <div
        className="px-4 sm:px-6 md:px-8 lg:px-[10%] mb-10 sm:mb-14"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div className="container mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] mb-5">
            <span
              className="text-[10px] sm:text-xs font-bold tracking-widest uppercase"
              style={{ color: 'var(--color-primary-light)' }}
            >
              Featured Projects
            </span>
          </div>

          {/* Title + View All row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                Highlighted{' '}
                <span style={{ color: 'var(--color-primary-light)' }}>Work</span>
              </h2>
              <p
                className="mt-2 text-sm sm:text-base"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Handpicked projects I&apos;m most proud of.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium shrink-0 transition-opacity hover:opacity-70 whitespace-nowrap cursor-target"
              style={{ color: 'var(--color-primary-light)' }}
              aria-label={`View all ${projects.length} projects`}
            >
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onMouseEnter={() => { isHoveredRef.current = true  }}
        onMouseLeave={() => { isHoveredRef.current = false }}
        role="region"
        aria-label="Projects carousel"
      >
        {/* Left fade mask */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20"
          style={{ background: `linear-gradient(to right, var(--color-backdrop-base), transparent)` }}
        />
        {/* Right fade mask */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20"
          style={{ background: `linear-gradient(to left, var(--color-backdrop-base), transparent)` }}
        />

        {loading ? (
          /* Skeleton */
          <div
            className="flex py-4 px-4 sm:px-6 md:px-8 lg:px-[10%]"
            style={{ gap: CARD_GAP }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} cardWidth={cardWidth} />
            ))}
          </div>
        ) : (
          /* Animated track — only real 6 cards, no clones */
          <div
            ref={trackRef}
            className="flex will-change-transform select-none py-4"
            style={{
              gap: CARD_GAP,
              paddingLeft: CARD_GAP,
              paddingRight: CARD_GAP,
            }}
          >
            {featured.map((project, idx) => (
              <ProjectCard
                key={project.id || idx}
                project={project}
                cardWidth={cardWidth}
              />
            ))}
          </div>
        )}
      </div>


    </section>
  )
}

FeaturedProjects.displayName = 'FeaturedProjects'
export default memo(FeaturedProjects)
