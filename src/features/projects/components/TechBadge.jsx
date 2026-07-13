import { Globe, Layout, Cpu, Code, Package } from "lucide-react"

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
}

export default function TechBadge({ tech }) {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"]
  return (
    <div
      className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 rounded-xl border hover:border-[color:var(--color-primary-light)] transition-all duration-300 cursor-default"
      style={{
        background:
          "linear-gradient(to right, rgba(var(--color-primary-dark-rgb), 0.1), rgba(var(--color-primary-light-rgb), 0.1))",
        borderColor: "rgba(var(--color-primary-light-rgb), 0.2)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{
          background:
            "linear-gradient(to right, rgba(var(--color-primary-dark-rgb), 0.15), rgba(var(--color-primary-light-rgb), 0.15))",
        }}
      />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon
          className="w-3.5 h-3.5 md:w-4 md:h-4 transition-colors"
          style={{ color: "var(--color-primary-light)" }}
        />
        <span
          className="text-xs md:text-sm font-medium transition-colors"
          style={{ color: "var(--color-primary-light)" }}
        >
          {tech}
        </span>
      </div>
    </div>
  )
}
