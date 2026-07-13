import { memo, useMemo, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Award, GraduationCap } from "lucide-react"
import { useCertificates } from "../../certificates/hooks/useCertificates"
import { useCarouselAutoScroll } from "../../../hooks/useCarouselAutoScroll"

/* ─── Config carousel ───────────────────────────────────────────── */
const CERT_CARD_W = 240 // px
const CERT_CARD_GAP = 20 // px

/* ─── Certificate Card — fixed size for carousel ────────────────── */
const CertCard = memo(({ cert }) => {
  const title = cert.title || cert.Title || ""
  const img = cert.img || cert.Img

  return (
    <article
      className="group relative shrink-0 flex flex-col"
      style={{ width: CERT_CARD_W }}
      aria-label={title}
    >
      <div className="relative flex flex-col rounded-[16px] border-2 border-white/10 bg-[#0b0b18] overflow-hidden shadow-[4px_4px_0_rgba(255,255,255,0.06)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0_rgba(99,102,241,0.2)] group-hover:border-white/25 transition-all duration-200">
        {/* Certificate image */}
        <div
          className="relative overflow-hidden shrink-0"
          style={{ height: 160 }}
        >
          {img ? (
            <img
              src={img}
              alt={title || "Certificate"}
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
            style={{
              background:
                "linear-gradient(to top, #0b0b18 0%, transparent 100%)",
            }}
          />

          {/* Award badge overlay */}
          <div
            className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center border border-white/15"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Award
              className="w-4 h-4"
              style={{ color: "var(--color-primary-light)" }}
            />
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
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))",
          }}
        />
      </div>
    </article>
  )
})
CertCard.displayName = "CertCard"

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
  const certTrackRef = useRef(null)

  const featuredCerts = useMemo(() => certificates.slice(0, 10), [certificates])

  const isLoading = certsLoading
  const hasCerts = featuredCerts.length > 0

  /* Cert carousel */
  const getMaxOffset = useCallback(() => {
    const c = certContainerRef.current
    const t = certTrackRef.current
    if (!c || !t) return 0
    return Math.max(0, t.scrollWidth - c.clientWidth)
  }, [certContainerRef, certTrackRef])

  const { isHoveredRef } = useCarouselAutoScroll({
    trackRef: certTrackRef,
    getMaxOffset,
    enabled: hasCerts,
    scrollSpeed: 50,
    pauseAtStartMs: 800,
    startDelayMs: 700,
  })

  return (
    <section
      id="CertificatesHighlight"
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-20 sm:py-24"
      style={{ backgroundColor: "var(--color-backdrop-base)" }}
      aria-label="Certificates Highlight"
    >
      <div className="container mx-auto">
        {/* ── Section Header ── */}
        <div className="mb-10 sm:mb-14">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] mb-5">
            <span
              className="text-[10px] sm:text-xs font-bold tracking-widest uppercase"
              style={{ color: "var(--color-primary-light)" }}
            >
              Achievements
            </span>
          </div>

          {/* Title + View All row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                Professional{" "}
                <span style={{ color: "var(--color-primary-light)" }}>
                  Certificates
                </span>
              </h2>
              <p
                className="mt-2 text-sm sm:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                Validating skills and continuous learning through
                industry-recognised certifications.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {certificates.length > 0 && (
                <Link
                  to="/certificates"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap cursor-target"
                  style={{ color: "var(--color-primary-light)" }}
                  aria-label="View all certificates"
                >
                  <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 group-hover:after:w-full after:transition-all after:duration-300 after:h-[1.5px] after:bg-current">
                    View all certificates
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
              onMouseEnter={() => {
                isHoveredRef.current = true
              }}
              onMouseLeave={() => {
                isHoveredRef.current = false
              }}
              role="region"
              aria-label="Certificates carousel"
            >
              {/* Left fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24"
                style={{
                  background: `linear-gradient(to right, var(--color-backdrop-base), transparent)`,
                }}
              />
              {/* Right fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24"
                style={{
                  background: `linear-gradient(to left, var(--color-backdrop-base), transparent)`,
                }}
              />

              {/* Scrollable track */}
              <div
                ref={certTrackRef}
                className="flex will-change-transform select-none py-4"
                style={{
                  gap: CERT_CARD_GAP,
                  paddingLeft: CERT_CARD_GAP,
                  paddingRight: CERT_CARD_GAP,
                }}
              >
                {featuredCerts.map((cert, i) => (
                  <CertCard key={cert.id || i} cert={cert} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <GraduationCap
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              No certificates available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

EducationHighlight.displayName = "EducationHighlight"
export default memo(EducationHighlight)
