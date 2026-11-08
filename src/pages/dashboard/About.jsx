import { useState } from "react"
import { useToast } from "@/hooks/useToast"
import { useConfirm } from "@/components/ui/useConfirm"
import ToastStack from "@/components/ToastStack"
import { Sparkles, User, CheckCircle2 } from "lucide-react"
import Modal from "@/components/ui/Modal"
import AboutCard from "./components/AboutCard"
import AboutForm from "./components/AboutForm"
import AddNewButton from "./components/AddNewButton"
import { SkeletonCard } from "./components/aboutHelpers.jsx"
import { useAboutManagement } from "@/features/about-management/model/useAbout"

export default function About() {
  const [showCreate, setShowCreate] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const { toasts, pushToast, removeToast } = useToast()
  const confirm = useConfirm()
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

  const deleteItem = async (id) => {
    const ok = await confirm({
      title: "Delete this about content?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      tone: "danger",
    })
    if (!ok) return
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

        <AddNewButton onClick={() => setShowCreate(true)} label="New About" />
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
            <div className="mt-2">
              <AddNewButton
                onClick={() => setShowCreate(true)}
                label="Create About Profile"
              />
            </div>
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
