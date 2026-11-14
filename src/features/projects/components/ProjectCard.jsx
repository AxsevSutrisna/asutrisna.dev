import PropTypes from "prop-types"
import { ExternalLink, ArrowRight } from "lucide-react"
import PublicCtaButton from "@/components/ui/public-cta-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toSlug } from "@/shared/lib/slug"
import { trackEvent } from "@/shared/lib/analytics"

const CardProject = ({
  img,
  title,
  description,
  link: ProjectLink,
  id,
  category,
}) => {
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault()
      alert("Visit Link link is not available")
      return
    }
    trackEvent("project_live_click", { title })
  }

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault()
      alert("Project details are not available")
      return
    }
    trackEvent("project_details_click", { title })
  }

  return (
    <Card className="group relative h-full w-full overflow-hidden flex flex-col gap-4 p-4 rounded-2xl">
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl border-2 border-black/40">
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category ? (
          <span className="absolute top-3 left-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-sm border border-white/15 text-white">
            {category}
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <h3 className="font-display text-xl font-bold leading-snug text-white line-clamp-2">
          {title}
        </h3>
        <p
          className="text-base leading-relaxed line-clamp-3"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>
      </div>

      {/* Actions — tombol utama lebar + link eksternal sebagai ikon */}
      <div className="flex items-center gap-2 mt-auto">
        {ProjectLink ? (
          <Button
            asChild
            variant="neutral"
            size="icon"
            className="w-11 h-11 shrink-0 cursor-target"
          >
            <a
              href={ProjectLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLiveDemo}
              aria-label={`Visit ${title} live site`}
              title="Visit live site"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        ) : null}
        {id ? (
          <PublicCtaButton
            to={`/project/${toSlug(title)}`}
            text="View Details"
            icon={ArrowRight}
            onClick={handleDetails}
            className="flex-1 justify-center px-4 text-sm cursor-target"
          />
        ) : (
          <span className="flex-1 text-center text-xs text-gray-500">
            Details unavailable
          </span>
        )}
      </div>
    </Card>
  )
}

CardProject.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  link: PropTypes.string,
  id: PropTypes.number.isRequired,
  category: PropTypes.string,
}

export default CardProject
