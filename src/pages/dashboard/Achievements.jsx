import { useState, useEffect, useRef } from "react"
import Modal from "@/components/ui/Modal"
import { useToast } from "@/hooks/useToast"
import { useConfirm } from "@/components/ui/useConfirm"
import ToastStack from "@/components/ToastStack"
import { Trophy, Trash2, Pencil, Save, GripVertical } from "lucide-react"
import AddNewButton from "./components/AddNewButton"
import { useAchievementManagement } from "@/features/achievement-management/model/useAchievements"
import { useReorderDnD } from "@/shared/lib/useReorderDnD"

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

  // Textarea deskripsi auto-grow (seragam dengan form modul lain).
  const descriptionRef = useRef(null)
  const autoGrow = (el) => {
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`
  }
  useEffect(() => {
    autoGrow(descriptionRef.current)
  }, [])

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
            autoFocus
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
            ref={descriptionRef}
            value={form.deskripsi}
            onChange={(e) => {
              set("deskripsi")(e)
              autoGrow(e.target)
            }}
            onInput={(e) => autoGrow(e.target)}
            placeholder="Achievement quote or description"
            rows={3}
            className={`${inputCls} resize-none overflow-y-auto leading-relaxed`}
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
  const [showCreate, setShowCreate] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const { toasts, pushToast, removeToast } = useToast()
  const confirm = useConfirm()
  const {
    achievements,
    loading,
    saving,
    createAchievement,
    updateAchievement,
    removeAchievement,
    reorderAchievements,
  } = useAchievementManagement(pushToast)

  const dnd = useReorderDnD(achievements, reorderAchievements)

  const handleCreate = async (form) => {
    const ok = await createAchievement(form)
    if (ok) setShowCreate(false)
  }

  const handleUpdate = async (form) => {
    const ok = await updateAchievement(editItem.id, form)
    if (ok) setEditItem(null)
  }

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Delete this achievement?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      tone: "danger",
    })
    if (!ok) return
    removeAchievement(id)
  }

  return (
    <div className="space-y-6">
      <ToastStack toasts={toasts} onDismiss={removeToast} />

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
          label="Add Achievement"
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
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <GripVertical className="h-3.5 w-3.5 text-gray-600" />
            Seret kartu mana pun untuk mengubah urutan.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {achievements.map((item) => (
            <div
              key={item.id}
              {...dnd.getItemProps(item.id)}
              className={`relative ${dnd.isDragging(item.id) ? "opacity-60 scale-[0.99]" : ""} ${dnd.isDropTarget(item.id) ? "ring-2 ring-indigo-400/70 ring-offset-2 ring-offset-transparent shadow-[0_0_0_1px_rgba(129,140,248,0.25)]" : ""}`}
            >
              {dnd.isDropTarget(item.id) && !dnd.isDragging(item.id) && (
                <div className="absolute -inset-1 rounded-2xl border-2 border-dashed border-indigo-400/70 bg-indigo-500/10 pointer-events-none flex items-center justify-center text-indigo-200 text-xs font-medium tracking-widest uppercase z-10">
                  Drop to place here
                </div>
              )}

              <div className="relative group h-full">
                <div
                  className="absolute -inset-0.5 rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
                  }}
                />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full p-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="leading-tight">
                          <button
                            type="button"
                            onClick={() => setEditItem(item)}
                            title="Edit achievement"
                            className="cursor-target appearance-none border-0 bg-transparent p-0 text-left font-semibold text-white text-sm transition-colors hover:text-indigo-300 focus-visible:text-indigo-300 focus-visible:outline-none"
                          >
                            {item.title}
                          </button>
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
        </div>
      )}

      {showCreate && (
        <Modal
          title="Add New Achievement"
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
