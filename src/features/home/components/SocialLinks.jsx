import { memo } from "react"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Dribbble,
  Figma,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const getIcon = (name) => {
  const normalized = (name || "").toLowerCase()
  if (normalized.includes("github") || normalized.includes("git")) return Github
  if (normalized.includes("linkedin") || normalized.includes("link"))
    return Linkedin
  if (normalized.includes("instagram") || normalized.includes("insta"))
    return Instagram
  if (normalized.includes("facebook") || normalized.includes("fb"))
    return Facebook
  if (normalized.includes("youtube") || normalized.includes("yt"))
    return Youtube
  if (normalized.includes("twitter") || normalized.includes("x")) return Twitter
  if (normalized.includes("dribbble")) return Dribbble
  if (normalized.includes("figma")) return Figma
  if (normalized.includes("mail") || normalized.includes("email")) return Mail
  return ExternalLink
}

const SocialLink = memo(({ icon, platform, name, url, link, display_name }) => {
  const IconComponent = getIcon(icon || platform || name)
  const href = url || link || "#"
  const label = display_name || platform || name || "Social"

  return (
    <Button
      asChild
      variant="neutral"
      size="icon"
      className="rounded-xl cursor-target"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        <IconComponent className="w-4 h-4" />
      </a>
    </Button>
  )
})
SocialLink.displayName = "SocialLink"

export default SocialLink
