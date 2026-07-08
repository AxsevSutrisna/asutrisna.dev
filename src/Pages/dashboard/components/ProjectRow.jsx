import {
  CheckCircle2,
  Clock,
  Globe,
  Github,
  Layers,
  Zap,
  ImageIcon,
  ExternalLink,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react"

export default function ProjectRow({
  project,
  onDelete,
  onEdit,
  index,
  provided,
  isDragging,
}) {
  const title = project.title || project.Title || "Untitled"
  const desc = project.description || project.Description || ""
  const techStack =
    project.tech_stack || project.techstack || project.TechStack || []
  const features = project.features || project.Features || []
  const isPublished = project.is_published ?? true
  const imgSrc = project.img || project.Img || ""
  const liveUrl = project.link || project.Link || ""
  const githubUrl = project.github || project.Github || ""

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-300 cursor-target ${isDragging ? "bg-indigo-500/10 border-indigo-500/30 shadow-xl" : "border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.05]"}`}
      style={{
        ...provided.draggableProps.style,
        animationDelay: isDragging ? "0ms" : `${index * 50}ms`,
      }}
    >
      <div
        {...provided.dragHandleProps}
        className="text-gray-500 hover:text-white cursor-grab active:cursor-grabbing shrink-0 flex items-center justify-center cursor-target"
      >
        <GripVertical className="w-5 h-5 pointer-events-none" />
      </div>

      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/8 shrink-0">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white/15" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <span
            className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              isPublished
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/15 border-amber-500/30 text-amber-300"
            }`}
          >
            {isPublished ? (
              <CheckCircle2 className="w-2.5 h-2.5" />
            ) : (
              <Clock className="w-2.5 h-2.5" />
            )}
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>
        {desc && <p className="text-xs text-gray-500 truncate">{desc}</p>}
      </div>

      <div className="hidden sm:flex flex-wrap gap-1 w-40 shrink-0">
        {techStack.slice(0, 3).map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300/80 text-[10px]"
          >
            {t}
          </span>
        ))}
        {techStack.length > 3 && (
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px]">
            +{techStack.length - 3}
          </span>
        )}
      </div>

      <div className="hidden lg:flex flex-wrap gap-1 w-36 shrink-0">
        {features.slice(0, 2).map((f) => (
          <span
            key={f}
            className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300/80 text-[10px]"
          >
            {f}
          </span>
        ))}
        {features.length > 2 && (
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px]">
            +{features.length - 2}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/25 transition-all"
            title="Live site"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/25 transition-all"
            title="GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        )}
        <button
          onClick={() => onEdit(project)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/20 text-xs font-medium transition-all"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/8 border border-red-500/20 text-red-400 hover:bg-red-500/18 text-xs font-medium transition-all"
        >
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  )
}
