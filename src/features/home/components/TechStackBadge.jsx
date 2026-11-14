import { memo } from "react"
import { Badge } from "@/components/ui/badge"

const TechStackBadge = memo(({ tech }) => (
  <Badge
    variant="default"
    className="inline-flex text-xs px-3 py-1"
  >
    <span
      className="w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: "var(--color-primary-light)" }}
    />
    {tech}
  </Badge>
))
TechStackBadge.displayName = "TechStackBadge"

export default TechStackBadge
