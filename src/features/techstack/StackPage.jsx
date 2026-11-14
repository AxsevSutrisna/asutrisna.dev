
import { useState } from "react"
import { useTechStacks } from "./hooks/useTechStacks"
import {
  Code,
  Database,
  Layout,
  Shield,
  Smartphone,
  Cpu,
  BrainCircuit,
  Server,
  Globe,
} from "lucide-react"
const getCategoryConfig = (category) => {
  const cat = (category || "General").toLowerCase()
  if (cat.includes("backend") || cat.includes("server"))
    return { icon: Server, color: "text-emerald-400", bg: "bg-emerald-400" }
  if (cat.includes("frontend") || cat.includes("ui"))
    return { icon: Layout, color: "text-blue-400", bg: "bg-blue-400" }
  if (cat.includes("ai") || cat.includes("machine learning"))
    return { icon: BrainCircuit, color: "text-purple-400", bg: "bg-purple-400" }
  if (cat.includes("devops") || cat.includes("security"))
    return { icon: Shield, color: "text-amber-400", bg: "bg-amber-400" }
  if (cat.includes("mobile"))
    return { icon: Smartphone, color: "text-rose-400", bg: "bg-rose-400" }
  if (cat.includes("iot") || cat.includes("electronic"))
    return { icon: Cpu, color: "text-cyan-400", bg: "bg-cyan-400" }
  if (cat.includes("database"))
    return { icon: Database, color: "text-indigo-400", bg: "bg-indigo-400" }
  if (cat.includes("web") || cat.includes("general"))
    return { icon: Globe, color: "text-sky-400", bg: "bg-sky-400" }
  return { icon: Code, color: "text-gray-400", bg: "bg-gray-400" }
}

/* Satu ikon tool — kalau gambar gagal dimuat, tampilkan badge 2 huruf (rapi). */
const ToolIcon = ({ stack }) => {
  const [failed, setFailed] = useState(false)
  const showImg = Boolean(stack.icon_url) && !failed
  return (
    <li
      title={stack.name}
      className="cursor-target flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 shadow-sm transition-all duration-300 hover:scale-110 hover:bg-white/10"
    >
      {showImg ? (
        <img
          src={stack.icon_url}
          alt={stack.name}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain drop-shadow-md"
          loading="lazy"
        />
      ) : (
        <span className="text-xs font-bold uppercase text-gray-300">
          {stack.name.substring(0, 2)}
        </span>
      )}
    </li>
  )
}

const TechCategoryCard = ({ category, stacks, animation }) => {
  const toolsList = stacks.map((s) => s.name).join(", ")
  const toolCount = stacks.length
  const { icon: Icon, color } = getCategoryConfig(category)

  const titleId = `stack-${String(category || "general")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`

  return (
    <article
      aria-labelledby={titleId}
      className="cursor-target rounded-3xl border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden group shadow-lg"
      data-aos={animation}
      data-aos-duration="1200"
    >
      {/* Dynamic Hover Background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: "var(--color-primary-light)" }}
      ></div>

      <div className="relative z-10 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <h3
              id={titleId}
              className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate"
            >
              {category || "General"}
            </h3>
          </div>
          <span
            className={`shrink-0 inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 ${color}`}
          >
            {toolCount} {toolCount === 1 ? "tool" : "tools"}
          </span>
        </div>

        {/* Description */}
        <p className="text-base text-gray-400 mb-6 min-h-[48px] leading-relaxed">
          {toolsList}
        </p>

        {/* Stack Icons Grid */}
        <ul
          className="flex flex-wrap gap-2 sm:gap-3 list-none p-0 m-0"
          aria-label={`${category || "General"} tools`}
        >
          {stacks.map((stack) => (
            <ToolIcon key={stack.id} stack={stack} />
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function StackPage() {
  const { techStacks, loading } = useTechStacks()

  const categories = Object.keys(techStacks)

  return (
    <div className="w-full px-[5%] md:px-[10%] overflow-x-clip">
      <div
        className="text-center mb-10 sm:mb-16"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
          My{" "}
          <span style={{ color: "var(--color-primary-light)" }}>
            Tech Stack
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-base">
          A comprehensive look at the tools and technologies I use to architect
          solutions and empower communities.
        </p>
      </div>

      {loading && categories.length === 0 ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <TechCategoryCard
              key={category}
              category={category}
              stacks={techStacks[category]}
              animation={
                index % 3 === 0
                  ? "fade-up-right"
                  : index % 3 === 1
                    ? "fade-up"
                    : "fade-up-left"
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
