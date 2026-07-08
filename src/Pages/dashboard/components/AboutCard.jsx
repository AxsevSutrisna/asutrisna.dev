import { useState } from "react"
import {
  CheckCircle2,
  Clock,
  Globe,
  EyeOff,
  Pencil,
  Trash2,
  Quote,
  Download,
  User,
  RefreshCw,
  FileText,
  Eye,
} from "lucide-react"
import { formatDate } from "./aboutHelpers.jsx"

export default function AboutCard({
  item,
  onEdit,
  onDelete,
  onTogglePublish,
  onViewCv,
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group relative rounded-2xl border border-white/8 overflow-hidden bg-white/[0.02] hover:border-white/20 transition-all duration-500"
      style={{
        boxShadow: hovered ? "0 0 48px -12px rgba(99,102,241,0.25)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-500 z-10"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "linear-gradient(90deg, transparent, var(--color-primary-light), transparent)",
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(99,102,241,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex flex-col sm:flex-row gap-0">
        <div className="relative w-full sm:w-56 shrink-0">
          <div className="relative w-full h-56 sm:h-full min-h-[200px] overflow-hidden bg-white/5">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-white/5" />
            )}
            {item.photo_url ? (
              <img
                src={item.photo_url}
                alt={item.name}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
                onError={(e) => {
                  e.currentTarget.src =
                    "/AsepSutrisnaSuhadaPutra-PhotoProfile.png"
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/80 via-transparent to-transparent pointer-events-none" />

            <div
              className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${
                item.is_published
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-gray-500/20 border-gray-500/30 text-gray-400"
              }`}
            >
              {item.is_published ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {item.is_published ? "Published" : "Draft"}
            </div>
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col gap-4 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-lg leading-tight group-hover:text-indigo-100 transition-colors duration-300">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-gray-500 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5" /> v{item.version || 1}
                </span>
                <span className="text-[11px] text-gray-600">
                  Updated {formatDate(item.updated_at)}
                </span>
              </div>
            </div>

            <div className="flex gap-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onTogglePublish(item)}
                title={item.is_published ? "Unpublish" : "Publish"}
                className={`cursor-target p-2 rounded-lg border text-xs transition-all duration-200 no-neo ${
                  item.is_published
                    ? "border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15"
                    : "border-white/10 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5"
                }`}
              >
                {item.is_published ? (
                  <Globe className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => onEdit(item)}
                title="Edit"
                className="cursor-target p-2 rounded-lg border border-indigo-500/25 bg-indigo-500/8 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-200 no-neo"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                title="Delete"
                className="cursor-target p-2 rounded-lg border border-red-500/20 bg-red-500/8 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 no-neo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 border-l-2 border-white/8 pl-3 group-hover:border-indigo-500/30 transition-colors duration-300">
            {item.description}
          </p>

          {item.role_badges && (
            <div className="flex flex-wrap gap-1.5">
              {item.role_badges
                .split(",")
                .map((r) => r.trim())
                .filter(Boolean)
                .map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-widest border border-white/10 bg-white/5 text-indigo-300 uppercase"
                  >
                    {role}
                  </span>
                ))}
            </div>
          )}

          {item.quote && (
            <div className="relative rounded-xl bg-indigo-500/8 border border-indigo-500/20 p-3.5 overflow-hidden">
              <div className="absolute top-2 right-3 text-indigo-500/20">
                <Quote className="w-8 h-8" />
              </div>
              <p className="text-xs text-indigo-300/90 italic leading-relaxed pr-8">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>
          )}

          <div className="mt-auto flex items-center gap-3">
            {item.cv_en_url || item.cv_id_url ? (
              <div className="flex gap-2">
                {item.cv_en_url && (
                  <button
                    onClick={() => onViewCv(item.cv_en_url)}
                    className="cursor-target flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-300 bg-white/5 hover:bg-indigo-500/10 border border-white/8 hover:border-indigo-500/25 rounded-lg px-3 py-1.5 transition-all duration-200 no-neo"
                  >
                    <Download className="w-3 h-3" /> CV (EN)
                  </button>
                )}
                {item.cv_id_url && (
                  <button
                    onClick={() => onViewCv(item.cv_id_url)}
                    className="cursor-target flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-300 bg-white/5 hover:bg-indigo-500/10 border border-white/8 hover:border-indigo-500/25 rounded-lg px-3 py-1.5 transition-all duration-200 no-neo"
                  >
                    <Download className="w-3 h-3" /> CV (ID)
                  </button>
                )}
              </div>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-gray-600 bg-white/3 border border-white/6 rounded-lg px-3 py-1.5">
                <FileText className="w-3 h-3" /> No CV attached
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
