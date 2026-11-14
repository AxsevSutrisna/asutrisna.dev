import { useMemo, useState } from "react"
import Modal from "@/components/ui/Modal"
import { FieldError } from "@/components/ui/FieldError"
import { useToast } from "@/hooks/useToast"
import { useConfirm } from "@/components/ui/useConfirm"
import ToastStack from "@/components/ToastStack"
import { useSocialLinkManagement } from "@/features/social-link-management/model/useSocialLinks"
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Link2,
  GripVertical,
  Palette,
  Settings2,
  Linkedin,
  Instagram,
  Youtube,
  Github,
  Twitter,
  Facebook,
  Globe,
  MessageCircle,
} from "lucide-react"
import AddNewButton from "./components/AddNewButton"
import { useReorderDnD } from "@/shared/lib/useReorderDnD"

const getLucideIcon = (name) => {
  switch (name?.toLowerCase()) {
    case "linkedin":
      return Linkedin
    case "instagram":
      return Instagram
    case "youtube":
      return Youtube
    case "github":
      return Github
    case "twitter":
      return Twitter
    case "facebook":
      return Facebook
    case "tiktok":
      return MessageCircle // TikTok doesn't have a native Lucide icon
    default:
      return Globe
  }
}

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div
      className="absolute -inset-0.5 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"
      style={{
        background:
          "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
      }}
    />
    <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl h-full overflow-hidden">
      {children}
    </div>
  </div>
)

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
  error,
  autoFocus = false,
  hint,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
      {label}
      {required ? <span className="text-red-400"> *</span> : ""}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      autoFocus={autoFocus}
      className={`cursor-target w-full bg-[#0d0d22] border rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all ${error ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20" : "border-white/10"}`}
    />
    {hint && !error && <p className="text-[11px] text-gray-500">{hint}</p>}
    <FieldError message={error} />
  </div>
)

const PLATFORM_PRESETS = {
  linkedin: {
    platform: "LinkedIn",
    display_name: "Let's Connect",
    sub_text: "on LinkedIn",
    icon: "Linkedin",
    color: "#0A66C2",
  },
  instagram: {
    platform: "Instagram",
    display_name: "Instagram",
    sub_text: "@username",
    icon: "Instagram",
    color: "#E4405F",
  },
  youtube: {
    platform: "YouTube",
    display_name: "YouTube",
    sub_text: "@channel",
    icon: "Youtube",
    color: "#FF0000",
  },
  github: {
    platform: "GitHub",
    display_name: "GitHub",
    sub_text: "@username",
    icon: "Github",
    color: "#24292e",
  },
  tiktok: {
    platform: "TikTok",
    display_name: "TikTok",
    sub_text: "@username",
    icon: "TikTok",
    color: "#000000",
  },
}

const normalizePlatformKey = (val) =>
  String(val || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")

const COLOR_PALETTE = [
  "#0A66C2",
  "#E4405F",
  "#FF0000",
  "#24292e",
  "#000000",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
]
const isValidUrl = (value) => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

const validateSocialLinkForm = (form) => {
  const errors = {}

  if (!String(form.platform || "").trim()) {
    errors.platform = "Platform wajib diisi."
  }

  if (!String(form.display_name || "").trim()) {
    errors.display_name = "Display name wajib diisi."
  }

  if (!String(form.url || "").trim()) {
    errors.url = "URL wajib diisi."
  } else if (!isValidUrl(form.url)) {
    errors.url = "URL tidak valid."
  }

  return errors
}

/* ── Premium Social Link Card ── */
const SocialLinkCard = ({
  item,
  onEdit,
  onDelete,
  onToggleActive,
  onSetPrimary,
  isDragging,
  isDropTarget,
}) => {
  const urlDomain = useMemo(() => {
    try {
      return new URL(item.url).hostname.replace("www.", "")
    } catch {
      return item.url.slice(0, 30)
    }
  }, [item.url])

  const IconComp = getLucideIcon(item.icon)
  const isCustomIcon = item.icon?.includes("/")

  return (
    <Card
      className={`${isDragging ? "opacity-40 scale-95" : ""} ${isDropTarget ? "ring-2 ring-indigo-500/80 ring-offset-2 ring-offset-[#0a0a1a]" : ""}`}
    >
      <div className="relative flex flex-col h-full p-5 gap-4 group/card">
        {/* Drag Handle Area */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-white/5 border-r border-white/5">
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>

        {/* Subtle Background Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 80% 0%, ${item.color}25 0%, transparent 50%)`,
          }}
        />

        <div className="pl-6 sm:pl-4 flex-1 flex flex-col relative z-10 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-white text-lg truncate flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  title="Edit social link"
                  className="cursor-target appearance-none border-0 bg-transparent p-0 text-left truncate transition-colors hover:text-indigo-300 focus-visible:text-indigo-300 focus-visible:outline-none"
                >
                  {item.display_name}
                </button>
                {item.is_primary && (
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 shrink-0" />
                )}
              </h3>
              <p className="text-gray-400 text-sm truncate mt-0.5">
                {item.sub_text}
              </p>
            </div>
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-xl"
              style={{ background: item.color || "#333" }}
            >
              {isCustomIcon ? (
                <img
                  src={item.icon}
                  alt={item.platform}
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <IconComp className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          {/* URL Pill */}
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 w-fit max-w-full">
            <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target text-xs text-gray-300 hover:text-white truncate transition-colors"
            >
              {urlDomain}
            </a>
          </div>

          {/* Actions Row */}
          <div className="mt-auto pt-5 flex items-center justify-between gap-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider ${item.is_active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-gray-500"}`}
              >
                {item.is_active ? "Active" : "Hidden"}
              </span>
              <span className="text-[10px] text-gray-600 px-2 uppercase tracking-wider">
                #{item.sort_order}
              </span>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => onSetPrimary(item)}
                title="Primary"
                className={`cursor-target p-1.5 rounded-md border transition-colors no-neo ${item.is_primary ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                <Star className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onToggleActive(item)}
                title="Toggle Visibility"
                className="cursor-target p-1.5 rounded-md border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors no-neo"
              >
                {item.is_active ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => onEdit(item)}
                title="Edit"
                className="cursor-target p-1.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors no-neo"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                title="Delete"
                className="cursor-target p-1.5 rounded-md border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors no-neo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ── Premium Social Link Form ── */
const SocialLinkForm = ({ initial, onSubmit, onCancel, uploading }) => {
  const [form, setForm] = useState({
    platform: initial?.platform || "",
    display_name: initial?.display_name || "",
    sub_text: initial?.sub_text || "",
    url: initial?.url || "",
    icon: initial?.icon || "",
    color: initial?.color || "",
    sort_order: initial?.sort_order ?? "",
    is_primary: initial?.is_primary ?? false,
    is_active: initial?.is_active ?? true,
  })
  const [iconFile, setIconFile] = useState(null)
  const [iconPreview, setIconPreview] = useState(initial?.icon || null)
  const [errors, setErrors] = useState({})

  const clearError = (key) =>
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })

  // Isi otomatis dari preset (cara cepat); field tetap bisa disesuaikan.
  const applyPreset = (preset) => {
    setForm((f) => ({
      ...f,
      platform: preset.platform,
      display_name: preset.display_name,
      sub_text: preset.sub_text,
      icon: preset.icon,
      color: preset.color,
    }))
    setErrors({})
  }

  const set = (key) => (e) => {
    let val = e.target.type === "checkbox" ? e.target.checked : e.target.value
    if (key === "sort_order") {
      val = val === "" ? "" : Math.max(0, Number(val) || 0)
    }
    setForm((f) => ({ ...f, [key]: val }))
    if (typeof val !== "boolean") clearError(key)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIconFile(file)
    try {
      setIconPreview(URL.createObjectURL(file))
    } catch {
      setIconPreview(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = validateSocialLinkForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    onSubmit(form, iconFile)
  }

  const sectionTitle = (icon, text) => (
    <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest my-1">
      <div className="flex-1 h-px bg-white/6" />
      <span className="flex items-center gap-1.5">
        {icon} {text}
      </span>
      <div className="flex-1 h-px bg-white/6" />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-5">
      {sectionTitle(<Settings2 className="w-3 h-3" />, "Presets & Info")}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
            {Object.values(PLATFORM_PRESETS).map((preset) => (
              <button
                key={preset.platform}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`cursor-target shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all no-neo ${normalizePlatformKey(form.platform) === normalizePlatformKey(preset.platform) ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-200" : "border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"}`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: preset.color }}
                />
                {preset.platform}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            Pilih preset untuk mengisi otomatis, lalu sesuaikan bila perlu.
          </p>
        </div>

        <InputField
          label="Platform"
          value={form.platform}
          onChange={set("platform")}
          placeholder="e.g. LinkedIn"
          required
          autoFocus
          error={errors.platform}
          hint="Dipakai sebagai label & ikon bawaan."
        />
        <InputField
          label="Display Name"
          value={form.display_name}
          onChange={set("display_name")}
          placeholder="e.g. Let's Connect"
          required
          error={errors.display_name}
          hint="Teks utama yang tampil di kartu."
        />
        <InputField
          label="Sub Text"
          value={form.sub_text}
          onChange={set("sub_text")}
          placeholder="e.g. on LinkedIn"
        />
        <InputField
          label="URL"
          value={form.url}
          onChange={set("url")}
          placeholder="https://example.com"
          required
          error={errors.url}
        />
      </div>

      {sectionTitle(<Palette className="w-3 h-3" />, "Styling")}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left: Icon Upload */}
        <div className="space-y-1.5">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
            Icon
          </label>
          <label className="cursor-target flex items-center gap-3 w-full bg-[#0d0d22] border border-dashed border-white/15 rounded-xl px-4 py-3 cursor-pointer hover:border-indigo-500/40 hover:bg-white/4 transition-all">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              {iconPreview && iconPreview.includes("/") ? (
                <img
                  src={iconPreview}
                  alt="preview"
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <Link2 className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-300 truncate">
                {iconFile ? iconFile.name : "Upload custom icon"}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">
                Atau ketik nama ikon bawaan di bawah
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <input
            type="text"
            value={form.icon}
            onChange={set("icon")}
            placeholder="Nama ikon bawaan: LinkedIn, GitHub, YouTube…"
            className="cursor-target w-full bg-[#0d0d22] border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 text-xs outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Right: Color Selection */}
        <div className="space-y-1.5">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
            Brand Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_PALETTE.slice(0, 8).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm((f) => ({ ...f, color }))}
                className={`cursor-target w-8 h-8 rounded-full border-2 transition-transform no-neo ${form.color === color ? "border-white scale-110" : "border-transparent hover:scale-105"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div
              className="w-8 h-8 rounded-lg border border-white/10"
              style={{ backgroundColor: form.color || "#333" }}
            />
            <input
              type="text"
              value={form.color}
              onChange={set("color")}
              placeholder="#HEX"
              className="cursor-target flex-1 bg-[#0d0d22] border border-white/10 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {sectionTitle(<ExternalLink className="w-3 h-3" />, "Visibility & Order")}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Sort Order"
          type="number"
          value={form.sort_order}
          onChange={set("sort_order")}
          placeholder="Empty = bottom"
          min="0"
        />
        <div className="space-y-3 pt-6">
          <label className="cursor-target flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_primary}
              onChange={set("is_primary")}
              className="cursor-target accent-indigo-500 w-4 h-4 rounded"
            />
            Mark as Primary Link
          </label>
          <label className="cursor-target flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={set("is_active")}
              className="cursor-target accent-indigo-500 w-4 h-4 rounded"
            />
            Active & Visible
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
        {Object.keys(errors).length > 0 && (
          <p className="mr-auto self-center text-sm text-red-400">
            Masih ada field wajib yang belum diisi.
          </p>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="cursor-target px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors no-neo"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="cursor-target relative group/s no-neo"
        >
          <div
            className="absolute -inset-0.5 rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300"
            style={{
              background:
                "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
            }}
          />
          <div
            className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10"
            style={{ backgroundColor: "var(--color-backdrop-base)" }}
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-sm font-medium text-gray-200">
              {uploading ? "Saving..." : initial ? "Update" : "Create"}
            </span>
          </div>
        </button>
      </div>
    </form>
  )
}

/* ── Main Dashboard ── */
export default function SocialLinksDashboard() {
  const [showCreate, setShowCreate] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const { toasts, pushToast, removeToast } = useToast()
  const confirm = useConfirm()
  const {
    items,
    loading,
    uploading,
    createItem,
    updateItem,
    removeItem,
    toggleActive,
    setPrimary,
    reorderItems,
  } = useSocialLinkManagement(pushToast)

  const dnd = useReorderDnD(items, reorderItems)

  const handleCreate = async (form, iconFile) => {
    const ok = await createItem(form, iconFile)
    if (ok) setShowCreate(false)
  }

  const handleEdit = async (form, iconFile) => {
    if (!editItem) return
    const ok = await updateItem(editItem.id, form, iconFile)
    if (ok) setEditItem(null)
  }

  const deleteItem = async (id) => {
    const ok = await confirm({
      title: "Delete this social link?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      tone: "danger",
    })
    if (!ok) return
    removeItem(id)
  }

  const activePrimary = useMemo(() => items.find((i) => i.is_primary), [items])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              className="absolute -inset-1 rounded-xl blur-md opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))",
              }}
            />
            <div
              className="relative w-10 h-10 rounded-xl border border-white/15 flex items-center justify-center"
              style={{ backgroundColor: "var(--color-backdrop-base)" }}
            >
              <Link2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Social Links
            </h1>
            {!loading && (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[11px] text-gray-400 bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">
                  {items.length} links
                </span>
                {activePrimary && (
                  <span className="flex items-center gap-1 text-[11px] text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2.5 py-0.5">
                    <Star className="w-3 h-3 fill-current" />{" "}
                    {activePrimary.display_name}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <AddNewButton onClick={() => setShowCreate(true)} label="Add Social Link" />
      </div>

      {showCreate && (
        <Modal title="Add New Social Link" onClose={() => setShowCreate(false)}>
          <SocialLinkForm
            initial={null}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            uploading={uploading}
          />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Social Link" onClose={() => setEditItem(null)}>
          <SocialLinkForm
            initial={editItem}
            onSubmit={handleEdit}
            onCancel={() => setEditItem(null)}
            uploading={uploading}
          />
        </Modal>
      )}

      {loading ? (
        <div className="h-40 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
      ) : items.length === 0 ? (
        <div className="py-24 text-center rounded-2xl border border-white/10 bg-white/5 border-dashed">
          <Link2 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No social links yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-5">
          {items.map((item) => (
            <div key={item.id} {...dnd.getItemProps(item.id)}>
              <SocialLinkCard
                item={item}
                onEdit={setEditItem}
                onDelete={deleteItem}
                onToggleActive={toggleActive}
                onSetPrimary={setPrimary}
                isDragging={dnd.isDragging(item.id)}
                isDropTarget={dnd.isDropTarget(item.id)}
              />
            </div>
          ))}
        </div>
      )}
      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}
