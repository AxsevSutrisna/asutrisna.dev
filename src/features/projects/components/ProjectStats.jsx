import { Code2, Layers } from "lucide-react"

export default function ProjectStats({ project }) {
  const techStackCount = project?.TechStack?.length || 0
  const featuresCount = project?.Features?.length || 0

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 rounded-xl overflow-hidden relative"
      style={{ backgroundColor: "var(--color-backdrop-glow)" }}
    >
      <div
        className="absolute inset-0 opacity-50 blur-2xl z-0"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(var(--color-primary-dark-rgb), 0.2), rgba(var(--color-primary-light-rgb), 0.2))",
        }}
      />
      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-[color:var(--color-border-light)] transition-all duration-300 hover:scale-105 hover:border-[color:var(--color-primary-light)] hover:shadow-lg">
        <div
          className="p-1.5 md:p-2 rounded-full"
          style={{
            backgroundColor: "rgba(var(--color-primary-dark-rgb), 0.2)",
          }}
        >
          <Code2
            className="w-4 h-4 md:w-6 md:h-6"
            style={{ color: "var(--color-primary-light)" }}
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-white/90">
            {techStackCount}
          </div>
          <div
            className="text-[10px] md:text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Total Teknologi
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-[color:var(--color-border-light)] transition-all duration-300 hover:scale-105 hover:border-[color:var(--color-primary-light)] hover:shadow-lg">
        <div
          className="p-1.5 md:p-2 rounded-full"
          style={{
            backgroundColor: "rgba(var(--color-primary-light-rgb), 0.2)",
          }}
        >
          <Layers
            className="w-4 h-4 md:w-6 md:h-6"
            style={{ color: "var(--color-primary-light)" }}
            strokeWidth={1.5}
          />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-white/90">
            {featuresCount}
          </div>
          <div
            className="text-[10px] md:text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Fitur Utama
          </div>
        </div>
      </div>
    </div>
  )
}
