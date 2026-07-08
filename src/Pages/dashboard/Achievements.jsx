import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { supabase } from "../../config/supabase"
import { useToast } from "../../hooks/useToast"
import ToastStack from "../../components/ToastStack"
import { Trophy, Trash2, Pencil, X, Save, GripVertical } from "lucide-react"
import AddNewButton from "./components/AddNewButton"

const Modal = ({ title, onClose, children }) =>
  ReactDOM.createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-2xl flex flex-col"
        style={{ maxHeight: "calc(100vh - 24px)" }}
      >
        <div
          className="absolute -inset-0.5 rounded-2xl blur opacity-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
          }}
        />
        <div className="relative bg-[#0a0a1a] border border-white/12 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-white transition-colors cursor-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  )

const AchievementForm = ({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
  saving,
}) => {
  const [form, setForm] = useState({
    title: initial?.title || "",
    deskripsi: initial?.deskripsi || "",
    place: initial?.place || "",
    badge_text: initial?.badge_text || "",
    date: initial?.date || "",
    level_competition: initial?.level_competition || "",
    sort_order: initial?.sort_order ?? "",
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const inputCls =
    "w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-target"
  const labelCls =
    "text-xs text-indigo-300/70 uppercase tracking-wider font-medium"

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className={labelCls}>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. LKS Web Development"
            required
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Place *</label>
          <input
            type="text"
            value={form.place}
            onChange={set("place")}
            placeholder="e.g. 1ST PLACE"
            required
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Badge Text</label>
          <input
            type="text"
            value={form.badge_text}
            onChange={set("badge_text")}
            placeholder="e.g. NATIONAL"
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Date *</label>
          <input
            type="text"
            value={form.date}
            onChange={set("date")}
            placeholder="e.g. Aug 2025"
            required
            className={inputCls}
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Level Competition *</label>
          <input
            type="text"
            value={form.level_competition}
            onChange={set("level_competition")}
            placeholder="e.g. National Web Dev Competition"
            required
            className={inputCls}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className={labelCls}>Description</label>
          <textarea
            value={form.deskripsi}
            onChange={set("deskripsi")}
            placeholder="Achievement quote or description"
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className={labelCls}>Sort Order</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={set("sort_order")}
            placeholder="Leave empty to place at the bottom"
            className={inputCls}
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Optional. If left empty, the achievement will be placed at the
            bottom automatically.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors cursor-target no-neo"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="relative group/s cursor-target"
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
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-sm font-medium text-gray-200">
              {saving ? "Saving..." : submitLabel}
            </span>
          </div>
        </button>
      </div>
    </form>
  )
}

export default function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [saving, setSaving] = useState(false)

  const [draggingId, setDraggingId] = useState(null)
  const [dropTargetId, setDropTargetId] = useState(null)

  const { toasts, pushToast, removeToast } = useToast()

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })

      if (error) throw error
      setAchievements(data || [])
    } catch (err) {
      pushToast("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAchievements()
  }, [])

  const getNextSortOrder = () => {
    const highestSortOrder = achievements.reduce((highest, item) => {
      const currentSortOrder = Number(item.sort_order || 0)
      return currentSortOrder > highest ? currentSortOrder : highest
    }, 0)
    return highestSortOrder + 1
  }

  const resolveSortOrder = (value) => {
    if (value === "" || value === null || value === undefined) {
      return getNextSortOrder()
    }
    const parsedSortOrder = Number(value)
    return Number.isNaN(parsedSortOrder) ? getNextSortOrder() : parsedSortOrder
  }

  const persistOrder = async (orderedItems) => {
    const updates = orderedItems.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }))
    const { error } = await supabase.from("achievements").upsert(updates)
    if (error) throw error
    setAchievements(updates)
  }

  const handleDragStart = (id) => setDraggingId(id)
  const handleDragOver = (event) => event.preventDefault()
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
    if (!draggingId || draggingId === targetId) return

    const currentItems = [...achievements]
    const sourceIndex = currentItems.findIndex((item) => item.id === draggingId)
    const targetIndex = currentItems.findIndex((item) => item.id === targetId)

    if (sourceIndex === -1 || targetIndex === -1) return

    const nextItems = [...currentItems]
    const [movedItem] = nextItems.splice(sourceIndex, 1)
    nextItems.splice(targetIndex, 0, movedItem)

    try {
      await persistOrder(nextItems)
    } catch (error) {
      pushToast("error", error.message || "Failed to reorder achievements")
    } finally {
      setDraggingId(null)
      setDropTargetId(null)
    }
  }

  const handleCreate = async (form) => {
    try {
      setSaving(true)
      const sortOrder = resolveSortOrder(form.sort_order)
      const { error } = await supabase
        .from("achievements")
        .insert([{ ...form, sort_order: sortOrder }])
      if (error) throw error
      pushToast("success", "Achievement created!")
      setShowCreate(false)
      fetchAchievements()
    } catch (err) {
      pushToast("error", err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (form) => {
    try {
      setSaving(true)
      const sortOrder = resolveSortOrder(form.sort_order)
      const { error } = await supabase
        .from("achievements")
        .update({ ...form, sort_order: sortOrder })
        .eq("id", editItem.id)
      if (error) throw error
      pushToast("success", "Achievement updated!")
      setEditItem(null)
      fetchAchievements()
    } catch (err) {
      pushToast("error", err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this achievement?"))
      return
    try {
      const { error } = await supabase
        .from("achievements")
        .delete()
        .eq("id", id)
      if (error) throw error
      pushToast("success", "Achievement removed.")
      fetchAchievements()
    } catch (err) {
      pushToast("error", err.message)
    }
  }

  return (
    <div className="space-y-6">
      <ToastStack toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            Achievements
          </h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Manage your competitive and academic achievements.
          </p>
        </div>
        <AddNewButton
          onClick={() => setShowCreate(true)}
          label="New Achievement"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading achievements...
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-white/5">
          <Trophy className="w-10 h-10 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 font-medium">No achievements found</p>
          <p className="text-sm text-gray-500 mt-1">
            Add your first achievement to showcase your skills.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {achievements.map((item) => (
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
                <div className="absolute -inset-1 rounded-2xl border-2 border-dashed border-indigo-400/70 bg-indigo-500/10 pointer-events-none flex items-center justify-center text-indigo-200 text-xs font-medium tracking-widest uppercase z-10">
                  Drop to place here
                </div>
              )}

              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-[#0f172a] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full p-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm">
                          {item.title}
                        </h3>
                        {item.badge_text && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] border bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
                            {item.badge_text}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs">
                        {item.level_competition}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditItem(item)}
                        className="p-2 rounded-lg border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-target"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-target"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest cursor-move">
                    <GripVertical className="w-4 h-4 text-gray-600" />
                    Drag to reorder
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                      <Trophy className="w-8 h-8 text-indigo-400/50" />
                    </div>

                    <div className="space-y-1 text-sm flex-1 min-w-0">
                      <p className="text-gray-300 truncate">{item.date}</p>
                      <p className="text-gray-500 text-xs">
                        Order: {item.sort_order ?? 0}
                      </p>
                      {item.place && (
                        <p className="text-indigo-400 text-xs truncate">
                          {item.place}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal
          title="Create New Achievement"
          onClose={() => setShowCreate(false)}
        >
          <AchievementForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel="Create"
            saving={saving}
          />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Achievement" onClose={() => setEditItem(null)}>
          <AchievementForm
            initial={editItem}
            onSubmit={handleUpdate}
            onCancel={() => setEditItem(null)}
            submitLabel="Save Changes"
            saving={saving}
          />
        </Modal>
      )}
    </div>
  )
}
