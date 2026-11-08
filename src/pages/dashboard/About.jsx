import { useState } from "react"
import { useToast } from "../../hooks/useToast"
import ToastStack from "../../components/ToastStack"
import { Plus, Sparkles, User, CheckCircle2 } from "lucide-react"
import Modal from "../../components/ui/Modal"
import AboutCard from "./components/AboutCard"
import AboutForm from "./components/AboutForm"
import { SkeletonCard } from "./components/aboutHelpers.jsx"
import { useAboutManagement } from "@/features/about-management/model/useAbout"

export default function About() {
  const [showCreate, setShowCreate] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const { toasts, pushToast, removeToast } = useToast()
  const {
    items,
    loading,
    uploading,
    createAbout,
    updateAbout,
    removeAbout,
    togglePublish,
    viewCv: handleViewCv,
  } = useAboutManagement(pushToast)

  const handleCreate = async (form, photoFile, cvFileEn, cvFileId) => {
    const ok = await createAbout(form, photoFile, cvFileEn, cvFileId)
    if (ok) setShowCreate(false)
  }

  const handleEdit = async (form, photoFile, cvFileEn, cvFileId) => {
    if (!editItem) return
    const ok = await updateAbout(editItem, form, photoFile, cvFileEn, cvFileId)
    if (ok) setEditItem(null)
  }

  const deleteItem = (id) => {
    if (!confirm("Delete this about content?")) return
    removeAbout(id)
  }

  const publishedCount = items.filter((i) => i.is_published).length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
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
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              About Content
            </h1>
            {!loading && (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">
                  <User className="w-3 h-3" /> {items.length} record
                  {items.length !== 1 ? "s" : ""}
                </span>
                {publishedCount > 0 && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                    <CheckCircle2 className="w-3 h-3" /> {publishedCount} live
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="cursor-target relative group shrink-0 no-neo"
        >
          <div
            className="absolute -inset-0.5 rounded-xl opacity-50 blur group-hover:opacity-90 transition duration-300"
            style={{
              background:
                "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
            }}
          />
          <div
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10"
            style={{ backgroundColor: "var(--color-backdrop-base)" }}
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-gray-200">New About</span>
          </div>
        </button>
      </div>

      {showCreate && (
        <Modal title="Add About Content" onClose={() => setShowCreate(false)}>
          <AboutForm
            initial={null}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            uploading={uploading}
            onViewCv={handleViewCv}
          />
        </Modal>
      )}
      {editItem && (
        <Modal title="Edit About Content" onClose={() => setEditItem(null)}>
          <AboutForm
            initial={editItem}
            onSubmit={handleEdit}
            onCancel={() => setEditItem(null)}
            uploading={uploading}
            onViewCv={handleViewCv}
          />
        </Modal>
      )}

      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
        </div>
      ) : items.length === 0 ? (
        <div className="relative rounded-2xl border border-white/8 border-dashed overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="relative py-24 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-300 font-medium text-sm">
                No about content yet
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Create your first about profile to show on your portfolio
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="cursor-target relative group mt-2 no-neo"
            >
              <div
                className="absolute -inset-0.5 rounded-xl opacity-50 blur group-hover:opacity-90 transition duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
                }}
              />
              <div
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-200"
                style={{ backgroundColor: "var(--color-backdrop-base)" }}
              >
                <Plus className="w-4 h-4 text-indigo-400" /> Create About
                Profile
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <AboutCard
              key={item.id}
              item={item}
              onEdit={setEditItem}
              onDelete={deleteItem}
              onTogglePublish={togglePublish}
              onViewCv={handleViewCv}
            />
          ))}
        </div>
      )}

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}
