import { memo, useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, GraduationCap } from 'lucide-react'
import { useCertificates } from '../../certificates/hooks/useCertificates'

/* ─── Config carousel (same engine as FeaturedProjects) ─────────── */
const CERT_CARD_W   = 240   // px
const CERT_CARD_GAP = 20    // px
const SCROLL_SPEED  = 50    // px/s
const PAUSE_END_MS  = 1800
const PAUSE_START_MS = 800
const START_DELAY_MS = 700

/* ─── Certificate Card — fixed size for carousel ────────────────── */
const CertCard = memo(({ cert }) => {
  const title = cert.title || cert.Title || ''
  const img   = cert.img   || cert.Img

  return (
    <article
      className="group relative shrink-0 flex flex-col"
      style={{ width: CERT_CARD_W }}
      aria-label={title}
    >
      <div className="relative flex flex-col rounded-[16px] border-2 border-white/10 bg-[#0b0b18] overflow-hidden shadow-[4px_4px_0_rgba(255,255,255,0.06)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0_rgba(99,102,241,0.2)] group-hover:border-white/25 transition-all duration-200">

        {/* Certificate image */}
        <div className="relative overflow-hidden shrink-0" style={{ height: 160 }}>
          {img ? (
            <img
              src={img}
              alt={title || 'Certificate'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/[0.03]">
              <Award className="w-10 h-10 opacity-15 text-white" />
            </div>
          )}

          {/* Bottom gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0b0b18 0%, transparent 100%)' }}
          />

          {/* Award badge overlay */}
          <div
            className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center border border-white/15"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <Award className="w-4 h-4" style={{ color: 'var(--color-primary-light)' }} />
          </div>
        </div>

        {/* Title */}
        {title && (
          <div className="px-4 pb-4 pt-3 flex-1 flex items-start">
            <p className="text-xs font-semibold text-white leading-relaxed line-clamp-2">
              {title}
            </p>
          </div>
        )}

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))' }}
        />
      </div>
    </article>
  )
})
CertCard.displayName = 'CertCard'

/* ─── RAF-based forward-return carousel for certificates ─────────── */
function useCertCarousel(containerRef, trackRef, items) {
  const isHoveredRef = useRef(false)

  const getMaxOffset = useCallback(() => {
    const c = containerRef.current
    const t = trackRef.current
    if (!c || !t) return 0
    return Math.max(0, t.scrollWidth - c.clientWidth)
  }, [containerRef, trackRef])

  useEffect(() => {
    if (items.length === 0) return

    let animId    = null
    let lastTs    = null
    let offset    = 0
    let phase     = 'forward'
    let paused    = false
    let pauseTimer = null

    const applyOffset = (px) => {
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-px}px, 0, 0)`
      }
    }

    const scheduleResume = (delayMs, nextPhase) => {
      paused = true
      pauseTimer = setTimeout(() => {
        paused = false
        phase  = nextPhase
        lastTs = null
        animId = requestAnimationFrame(tick)
      }, delayMs)
    }

    const tick = (timestamp) => {
      if (lastTs === null) lastTs = timestamp
      const dt = Math.min((timestamp - lastTs) / 1000, 0.05)
      lastTs = timestamp

      if (paused || isHoveredRef.current) {
        animId = requestAnimationFrame(tick)
        return
      }

      const maxOff = getMaxOffset()

      if (maxOff <= 0) {
        animId = requestAnimationFrame(tick)
        return
      }

      if (phase === 'forward') {
        offset = Math.min(offset + SCROLL_SPEED * dt, maxOff)
        applyOffset(offset)
        if (offset >= maxOff) {
          cancelAnimationFrame(animId)
          animId = null
          scheduleResume(PAUSE_END_MS, 'return')
          return
        }
      } else {
        offset = Math.max(offset - SCROLL_SPEED * dt, 0)
        applyOffset(offset)
        if (offset <= 0) {
          cancelAnimationFrame(animId)
          animId = null
          scheduleResume(PAUSE_START_MS, 'forward')
          return
        }
      }

      animId = requestAnimationFrame(tick)
    }

    pauseTimer = setTimeout(() => {
      animId = requestAnimationFrame(tick)
    }, START_DELAY_MS)

    return () => {
      if (animId)     cancelAnimationFrame(animId)
      if (pauseTimer) clearTimeout(pauseTimer)
    }
  }, [items, getMaxOffset, trackRef])

  return { isHoveredRef }
}

/* ─── Skeleton ─────────────────────────────────────────────────── */
const SkeletonCert = ({ w }) => (
  <div
    className="shrink-0 rounded-[16px] border-2 border-white/10 bg-white/[0.03] animate-pulse"
    style={{ width: w, height: 220 }}
  />
)

/* ─── EducationHighlight ─────────────────────────────────────────── */
const EducationHighlight = () => {
  const { certificates, loading: certsLoading } = useCertificates()

  const certContainerRef = useRef(null)
  const certTrackRef     = useRef(null)

  const featuredCerts = useMemo(() => certificates.slice(0, 10), [certificates])

  const isLoading = certsLoading
  const hasCerts  = featuredCerts.length > 0

  /* Cert carousel */
  const { isHoveredRef } = useCertCarousel(certContainerRef, certTrackRef, featuredCerts)

  return (
    <section
      id="CertificatesHighlight"
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-20 sm:py-24"
      style={{ backgroundColor: 'var(--color-backdrop-base)' }}
      aria-label="Certificates Highlight"
    >
      <div className="container mx-auto">

        {/* ── Section Header ── */}
        <div className="mb-10 sm:mb-14">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] mb-5">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-primary-light)' }}>
              Achievements
            </span>
          </div>

          {/* Title + View All row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                Professional{' '}
                <span style={{ color: 'var(--color-primary-light)' }}>Certificates</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--color-text-muted)' }}>
                Validating skills and continuous learning through industry-recognised certifications.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {certificates.length > 0 && (
                <Link
                  to="/certificates"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 whitespace-nowrap"
                  style={{ color: 'var(--color-primary-light)' }}
                  aria-label="View all certificates"
                >
                  All certificates <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        {isLoading ? (
          <div className="flex gap-5 overflow-hidden py-4">
            <SkeletonCert w={CERT_CARD_W} />
            <SkeletonCert w={CERT_CARD_W} />
            <SkeletonCert w={CERT_CARD_W} />
            <SkeletonCert w={CERT_CARD_W} />
            <SkeletonCert w={CERT_CARD_W} />
          </div>
        ) : hasCerts ? (
          <div className="w-full">
            {/* Carousel container */}
            <div
              ref={certContainerRef}
              className="relative overflow-hidden rounded-xl"
              onMouseEnter={() => { isHoveredRef.current = true  }}
              onMouseLeave={() => { isHoveredRef.current = false }}
              role="region"
              aria-label="Certificates carousel"
            >
              {/* Left fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24"
                style={{ background: `linear-gradient(to right, var(--color-backdrop-base), transparent)` }}
              />
              {/* Right fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24"
                style={{ background: `linear-gradient(to left, var(--color-backdrop-base), transparent)` }}
              />

              {/* Scrollable track */}
              <div
                ref={certTrackRef}
                className="flex will-change-transform select-none py-4"
                style={{ gap: CERT_CARD_GAP, paddingLeft: CERT_CARD_GAP, paddingRight: CERT_CARD_GAP }}
              >
                {featuredCerts.map((cert, i) => (
                  <CertCard key={cert.id || i} cert={cert} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <GraduationCap className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No certificates available yet.
            </p>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        {!isLoading && hasCerts && (
          <div className="mt-12 flex justify-center card-fade-up" style={{ '--delay': '200ms' }}>
            <Link
              to="/certificates"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-white/10 bg-white/[0.04] text-sm font-semibold text-white hover:border-white/25 hover:bg-white/[0.07] transition-all duration-200 shadow-[4px_4px_0_rgba(255,255,255,0.05)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(99,102,241,0.14)]"
            >
              View All {certificates.length} Certificates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

EducationHighlight.displayName = 'EducationHighlight'
export default memo(EducationHighlight)
