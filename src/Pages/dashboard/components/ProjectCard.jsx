import { useState } from "react"
import {
  ImageIcon,
  CheckCircle2,
  Clock,
  Globe,
  Github,
  Layers,
  Zap,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react"

export default function ProjectCard({ project, onDelete, onEdit }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const title = project.title || project.Title || "Untitled"
  const desc = project.description || project.Description || ""
  const techStack =
    project.tech_stack || project.techstack || project.TechStack || []
  const features = project.features || project.Features || []
  const isPublished = project.is_published ?? true
  const imgSrc = project.img || project.Img || ""
  const liveUrl = project.link || project.Link || ""
  const githubUrl = project.github || project.Github || ""
  const category = project.category || project.Category || ""

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-500 hover:border-white/20 hover:shadow-2xl"
      style={{
        boxShadow: hovered ? "0 0 40px -10px rgba(99,102,241,0.25)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full aspect-[16/9] overflow-hidden bg-white/5 shrink-0">
        {imgSrc ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-white/5" />
            )}
            <img
              src={imgSrc}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
            <div className="absolute inset-0 bg-[#0f172a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-white/10" />
          </div>
        )}

        <div
          className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur-sm ${
            isPublished
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-amber-500/20 border-amber-500/40 text-amber-300"
          }`}
        >
          {isPublished ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {isPublished ? "Published" : "Draft"}
        </div>

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target w-8 h-8 rounded-lg bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
              title="Live Preview"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target w-8 h-8 rounded-lg bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
              title="GitHub Repo"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          {category && (
            <span className="inline-block px-2 py-0.5 mb-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-medium tracking-wide">
              {category}
            </span>
          )}
          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors duration-300">
            {title}
          </h3>
          {desc && (
            <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
              {desc}
            </p>
          )}
        </div>

        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techStack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300/80 text-[11px]"
              >
                <Layers className="w-2.5 h-2.5" />
                {t}
              </span>
            ))}
            {techStack.length > 4 && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[11px]">
                +{techStack.length - 4} more
              </span>
            )}
          </div>
        )}

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300/80 text-[11px]"
              >
                <Zap className="w-2.5 h-2.5" />
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-white/8 flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target p-1.5 rounded-lg border border-white/8 text-gray-500 hover:text-white hover:border-white/20 transition-all hover:bg-white/5"
                title="Open live site"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target p-1.5 rounded-lg border border-white/8 text-gray-500 hover:text-white hover:border-white/20 transition-all hover:bg-white/5"
                title="Open GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(project)}
              className="cursor-target flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 text-xs font-medium transition-all duration-200"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="cursor-target flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/8 border border-red-500/20 text-red-400 hover:bg-red-500/18 hover:border-red-500/40 text-xs font-medium transition-all duration-200"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
