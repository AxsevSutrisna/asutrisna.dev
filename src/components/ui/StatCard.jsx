import { memo } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { ArrowUpRight } from "lucide-react"

const StatCard = memo(
  ({ icon: Icon, value, label, description, animation, href }) => {
    const isInternalLink = href && href.startsWith("/")
    const Wrapper = isInternalLink ? Link : href ? "a" : "div"
    const linkProps = isInternalLink ? { to: href } : href ? { href } : {}

    return (
      <Wrapper
        data-aos={animation}
        data-aos-duration={1300}
        className="relative group block h-full cursor-target"
        {...linkProps}
      >
        <div className="relative z-10 p-6 h-full flex flex-col justify-between rounded-xl border-2 border-white/10 bg-white/5 shadow-[6px_6px_0_rgba(255,255,255,0.15)] hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none hover:border-white/30 transition-all duration-200">
          <div
            className="absolute -z-10 inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"
            style={{
              background:
                "linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary-light))",
            }}
          ></div>

          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 transition-transform duration-500 group-hover:rotate-12 group-hover:bg-white/20">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <span
              className="text-4xl font-bold text-white"
              data-aos="fade-up-left"
              data-aos-duration="1500"
              data-aos-anchor-placement="top-bottom"
            >
              {value}
            </span>
          </div>

          <div>
            <p
              className="text-sm uppercase tracking-wider mb-2"
              style={{ color: "var(--color-text-secondary)" }}
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-anchor-placement="top-bottom"
            >
              {label}
            </p>
            <div className="flex items-center justify-between">
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-anchor-placement="top-bottom"
              >
                {description}
              </p>
              <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Wrapper>
    )
  }
)

StatCard.displayName = "StatCard"

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  animation: PropTypes.string,
  href: PropTypes.string,
}

export default StatCard
