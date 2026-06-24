import { memo } from 'react'
import { Mail, ArrowRight, Sparkles } from 'lucide-react'
import PublicCtaButton from '@/components/ui/public-cta-button'

const HomeCTA = () => {
  return (
    <section
      id="HomeCTA"
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-20 sm:py-28"
      style={{ backgroundColor: 'var(--color-backdrop-base)' }}
      aria-label="Contact Call to Action"
    >
      <div className="container mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md p-10 sm:p-16 text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Background gradient orbs */}
          <div
            className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: 'var(--color-primary-dark)' }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: 'var(--color-primary-light)' }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--color-primary-light)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Open to opportunities
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Let&apos;s Build Something{' '}
              <span
                className="relative inline-block"
                style={{ color: 'var(--color-primary-light)' }}
              >
                Amazing
                <span
                  className="absolute -bottom-1 left-0 w-full h-0.5 opacity-50 rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))' }}
                />
              </span>{' '}
              Together
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Whether you have a project in mind, want to collaborate, or simply want to say hello — my inbox is always open.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <PublicCtaButton
                to="/contact"
                text="Get In Touch"
                icon={Mail}
                className="px-8 py-3 text-base"
              />
              <PublicCtaButton
                to="/about"
                text="Learn More About Me"
                icon={ArrowRight}
                className="px-8 py-3 text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

HomeCTA.displayName = 'HomeCTA'
export default memo(HomeCTA)
