import { memo, useState, useEffect } from 'react'
import { supabase } from '../../../config/supabase'
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Dribbble,
  Figma,
  ExternalLink 
} from 'lucide-react'

// Icon mapping based on platform/icon name
const getIcon = (name) => {
  const normalized = (name || '').toLowerCase()
  if (normalized.includes('github') || normalized.includes('git')) return Github
  if (normalized.includes('linkedin') || normalized.includes('link')) return Linkedin
  if (normalized.includes('instagram') || normalized.includes('insta')) return Instagram
  if (normalized.includes('facebook') || normalized.includes('fb')) return Facebook
  if (normalized.includes('youtube') || normalized.includes('yt')) return Youtube
  if (normalized.includes('twitter') || normalized.includes('x')) return Twitter
  if (normalized.includes('dribbble')) return Dribbble
  if (normalized.includes('figma')) return Figma
  return ExternalLink
}

const HomeCTA = () => {
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('is_active', true)
          .order('is_primary', { ascending: false })
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })

        if (!error && data) {
          setSocialLinks(data)
        }
      } catch (error) {
        console.error('Error fetching social links:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [])

  if (loading && socialLinks.length === 0) {
    return (
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-10 sm:py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-10 text-center animate-pulse h-48" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="HomeCTA"
      className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-10 sm:py-16 pb-20 sm:pb-24"
      style={{ backgroundColor: 'var(--color-backdrop-base)' }}
      aria-label="Stay Connected"
    >
      <div className="container mx-auto max-w-4xl">
        <div
          className="relative z-10 rounded-xl border-2 border-white/10 bg-white/5 p-10 sm:p-14 text-center shadow-[6px_6px_0_rgba(255,255,255,0.15)] transition-all duration-200"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Dynamic color overlay matching Achievement card */}
          <div 
            className="absolute -z-10 inset-0 opacity-10 rounded-xl pointer-events-none" 
            style={{ background: 'linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary-light))' }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
                Stay <span style={{ color: 'var(--color-primary-light)' }}>Connected</span>
              </h2>
              <p 
                className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Follow my journey across platforms
              </p>
            </div>

            {/* Social Icons Row */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2">
              {socialLinks.map((social) => {
                const IconComponent = getIcon(social.icon || social.platform)
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-white/10 bg-white/5 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(255,255,255,0.15)] cursor-target overflow-hidden"
                    aria-label={social.display_name || social.platform}
                    title={social.display_name || social.platform}
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary-light))' }}
                    />
                    <IconComponent className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 text-white/70 group-hover:text-white transition-colors duration-300" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

HomeCTA.displayName = 'HomeCTA'
export default memo(HomeCTA)
