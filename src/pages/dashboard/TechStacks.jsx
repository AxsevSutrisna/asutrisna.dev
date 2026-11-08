import { useState } from "react"
import Modal from "@/components/ui/Modal"
import { FieldError } from "@/components/ui/FieldError"
import { useToast } from "@/hooks/useToast"
import ToastStack from "@/components/ToastStack"
import { SIMPLE_ICONS_BASE } from "@/constants/urls"
import { techStackSlug as toSlug } from "@/entities/techStack/lib/techStackSlug"
import { useTechStackManagement } from "@/features/techstack-management/model/useTechStacks"
import {
  Boxes,
  Pencil,
  Trash2,
  Upload,
  ImageIcon,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react"
import AddNewButton from "./components/AddNewButton"

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-[#0f172a] ] ] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
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
}) => (
  <div className="space-y-1.5">
    <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={type === "number" ? "0" : undefined}
      className="cursor-target w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
    />
  </div>
)

const TECH_CATEGORIES = [
  "Programming Language",
  "Frontend & UI",
  "Backend",
  "Mobile",
  "Database",
  "Cloud & DevOps",
  "Version Control",
  "Tools & Workflow",
]

const validateTechStackForm = (form, iconFile) => {
  const errors = {}

  if (!String(form.name || "").trim()) {
    errors.name = "Name wajib diisi."
  }

  const hasIcon = Boolean(iconFile || form.icon_url)
  if (!hasIcon) {
    errors.icon = "Icon wajib diupload atau masukkan URL."
  }

  return errors
}

const TechStackCard = ({ item, onEdit, onDelete, onToggleActive }) => (
  <Card>
    <div className="p-4 flex flex-col h-full gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-sm">{item.name}</h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] border ${item.is_active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-gray-500/10 border-gray-500/20 text-gray-400"}`}
            >
              {item.is_active ? "Active" : "Hidden"}
            </span>
          </div>
          <p className="text-gray-500 text-xs">/{item.slug}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleActive(item)}
            className="cursor-target p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            title={item.is_active ? "Deactivate" : "Activate"}
          >
            {item.is_active ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="cursor-target p-2 rounded-lg border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/10 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="cursor-target p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest">
        <GripVertical className="w-4 h-4 text-gray-600" />
        Drag to reorder
      </div>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
          {item.icon_url ? (
            <img
              src={item.icon_url}
              alt={item.name}
              className="w-14 h-14 object-contain"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-600" />
          )}
        </div>

        <div className="space-y-1 text-sm">
          <p className="text-gray-300">{item.category || "General"}</p>
          <p className="text-gray-500 text-xs">Order: {item.sort_order ?? 0}</p>
          {item.description ? (
            <p className="text-gray-400 text-xs line-clamp-2">
              {item.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  </Card>
)

const TechStackForm = ({ initial, onSubmit, onCancel, uploading }) => {
  const [form, setForm] = useState({
    name: initial?.name || "",
    slug: initial?.slug || "",
    category: initial?.category || "Frontend & UI",
    description: initial?.description || "",
    sort_order: initial?.sort_order ?? "",
    is_active: initial?.is_active ?? true,
    icon_url: initial?.icon_url || "",
  })
  const [iconFile, setIconFile] = useState(null)
  const [preview, setPreview] = useState(initial?.icon_url || null)
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(!initial)
  const [errors, setErrors] = useState({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  const set = (key) => (event) => {
    const value =
      key === "is_active" ? event.target.checked : event.target.value

    if (key === "name") {
      setForm((current) => ({
        ...current,
        name: value,
        slug: autoGenerateSlug ? toSlug(value) : current.slug,
      }))
      setErrors((current) => {
        if (!current.name) return current
        const next = { ...current }
        delete next.name
        return next
      })
      return
    }

    if (key === "slug") {
      setForm((current) => ({ ...current, slug: value }))
      setAutoGenerateSlug(!value)
      return
    }

    if (key === "sort_order") {
      const numValue = value === "" ? "" : Math.max(0, Number(value) || 0)
      setForm((current) => ({ ...current, [key]: numValue }))
      return
    }

    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleFile = (event) => {
    const file = event.target.files[0]
    if (!file) return
    setIconFile(file)
    setPreview(URL.createObjectURL(file))
    setForm((curr) => ({ ...curr, icon_url: "" }))
    setErrors((current) => {
      if (!current.icon) return current
      const next = { ...current }
      delete next.icon
      return next
    })
  }

  const fetchSimpleIcon = (e) => {
    e.preventDefault()
    if (!form.name) {
      setErrors((curr) => ({
        ...curr,
        name: "Isi nama terlebih dahulu untuk auto-fetch",
      }))
      return
    }
    const slug = toSlug(form.name)
    const url = `${SIMPLE_ICONS_BASE}/${slug}`
    setIconFile(null)
    setPreview(url)
    setForm((curr) => ({ ...curr, icon_url: url }))
    setErrors((curr) => {
      const n = { ...curr }
      delete n.icon
      return n
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateTechStackForm(form, iconFile)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit(form, iconFile)
  }

  const inputClass = (field) =>
    `cursor-target w-full bg-[#0d0d22] border rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all ${
      errors[field]
        ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
        : "border-white/10"
    }`

  const uploadClass = `cursor-target flex items-center gap-4 w-full bg-[#0d0d22] border rounded-xl px-4 py-4 cursor-pointer transition-all ${
    errors.icon
      ? "border-red-500/50 hover:border-red-500/70"
      : "border-dashed border-white/15 hover:border-indigo-500/40 hover:bg-white/4"
  }`

  return (
    <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
            Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. ReactJS"
            className={inputClass("name")}
          />
          <FieldError message={errors.name} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
            Category *
          </label>
          <select
            value={form.category}
            onChange={set("category")}
            className="cursor-target w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all appearance-none"
          >
            {TECH_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
              Icon *
            </label>
            <button
              type="button"
              onClick={fetchSimpleIcon}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-target font-medium"
            >
              Auto-fetch Icon
            </button>
          </div>
          <label className={uploadClass}>
            <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <ImageIcon className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 truncate">
                {iconFile
                  ? iconFile.name
                  : form.icon_url
                    ? form.icon_url
                    : "Click to upload icon file"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                PNG, SVG, WEBP recommended
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
          <FieldError message={errors.icon} />
        </div>

        <label className="cursor-target w-fit flex items-center gap-3 sm:col-span-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={set("is_active")}
            className="cursor-target accent-indigo-500 w-4 h-4"
          />
          Active and visible on portfolio
        </label>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 cursor-target mt-2"
          >
            {showAdvanced
              ? "▼ Hide Advanced Settings"
              : "▶ Show Advanced Settings"}
          </button>
        </div>

        {showAdvanced && (
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-white/10 rounded-xl bg-white/5 mt-2 transition-all">
            <div className="space-y-1.5">
              <InputField
                label="Slug"
                value={form.slug}
                onChange={set("slug")}
                placeholder="Auto-generated"
              />
              <p className="text-[11px] text-gray-500">
                Auto-generated if left empty.
              </p>
            </div>
            <div className="space-y-1.5">
              <InputField
                label="Sort Order"
                type="number"
                value={form.sort_order}
                onChange={set("sort_order")}
                placeholder="Auto (at bottom)"
              />
              <p className="text-[11px] text-gray-500">
                Auto-assigned if left empty.
              </p>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={3}
                className="cursor-target w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                placeholder="Optional description"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
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
          className="cursor-target relative group/s"
        >
          <div className="absolute -inset-0.5 bg-[#0f172a] ] ] rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
          <div className="relative flex items-center gap-2 px-5 py-2 bg-[#030014] rounded-xl border border-white/10">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-sm text-gray-200">
              {uploading ? "Saving..." : "Save Tech Stack"}
            </span>
          </div>
        </button>
      </div>
    </form>
  )
}

export default function TechStacks() {
  const [showCreate, setShowCreate] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [dropTargetId, setDropTargetId] = useState(null)
  const { toasts, pushToast, removeToast } = useToast()
  const {
    items,
    loading,
    uploading,
    createItem,
    updateItem,
    removeItem,
    toggleActive,
    reorderItems,
  } = useTechStackManagement(pushToast)

  const handleDragStart = (id) => setDraggingId(id)

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDragEnter = (id) => {
    if (draggingId && draggingId !== id) {
      setDropTargetId(id)
    }
  }

  const handleDragLeave = (id, event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      if (dropTargetId === id) {
        setDropTargetId(null)
      }
    }
  }

  const handleDrop = async (targetId) => {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null)
      setDropTargetId(null)
      return
    }

    const sourceIndex = items.findIndex((item) => item.id === draggingId)
    const targetIndex = items.findIndex((item) => item.id === targetId)

    setDraggingId(null)
    setDropTargetId(null)

    if (sourceIndex === -1 || targetIndex === -1) return

    const nextItems = [...items]
    const [movedItem] = nextItems.splice(sourceIndex, 1)
    nextItems.splice(targetIndex, 0, movedItem)

    await reorderItems(nextItems)
  }

  const handleCreate = async (form, iconFile) => {
    const ok = await createItem(form, iconFile)
    if (ok) setShowCreate(false)
  }

  const handleEdit = async (form, iconFile) => {
    if (!editItem) return
    const ok = await updateItem(editItem.id, form, iconFile)
    if (ok) setEditItem(null)
  }

  const deleteItem = (id) => {
    if (!confirm("Delete this tech stack?")) return
    removeItem(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-[#0f172a] ] ] rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
              <Boxes className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Tech Stack
            </h1>
            <p className="text-gray-500 text-xs">
              {loading ? "Loading..." : `${items.length} stacks total`}
            </p>
          </div>
        </div>

        <AddNewButton
          onClick={() => setShowCreate(true)}
          label="New Tech Stack"
        />
      </div>

      {showCreate && (
        <Modal title="Add Tech Stack" onClose={() => setShowCreate(false)}>
          <TechStackForm
            initial={null}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            uploading={uploading}
          />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Tech Stack" onClose={() => setEditItem(null)}>
          <TechStackForm
            initial={editItem}
            onSubmit={handleEdit}
            onCancel={() => setEditItem(null)}
            uploading={uploading}
          />
        </Modal>
      )}

      {loading ? (
        <Card>
          <div className="p-16 text-center">
            <Boxes className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading tech stacks...</p>
          </div>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Boxes className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No tech stack data yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(item.id)}
              onDragEnd={() => setDraggingId(null)}
              onDragEnter={() => handleDragEnter(item.id)}
              onDragLeave={(event) => handleDragLeave(item.id, event)}
              className={`relative ${draggingId === item.id ? "opacity-60 scale-[0.99]" : ""} ${dropTargetId === item.id ? "ring-2 ring-indigo-400/70 ring-offset-2 ring-offset-transparent shadow-[0_0_0_1px_rgba(129,140,248,0.25)]" : ""}`}
            >
              {dropTargetId === item.id && draggingId !== item.id && (
                <div className="absolute -inset-1 rounded-2xl border-2 border-dashed border-indigo-400/70 bg-indigo-500/10 pointer-events-none flex items-center justify-center text-indigo-200 text-xs font-medium tracking-widest uppercase">
                  Drop to place here
                </div>
              )}
              <TechStackCard
                item={item}
                onEdit={setEditItem}
                onDelete={deleteItem}
                onToggleActive={toggleActive}
              />
            </div>
          ))}
        </div>
      )}

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}
