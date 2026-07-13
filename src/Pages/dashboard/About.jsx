import { useEffect, useState } from "react"
import { supabase } from "../../config/supabase"
import { useToast } from "../../hooks/useToast"
import ToastStack from "../../components/ToastStack"
import { Plus, Sparkles, User, CheckCircle2 } from "lucide-react"
import Modal from "../../components/ui/Modal"
import AboutCard from "./components/AboutCard"
import AboutForm from "./components/AboutForm"
import { SkeletonCard } from "./components/aboutHelpers.jsx"

export default function About() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { toasts, pushToast, removeToast } = useToast()

  const fetchItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("about_contents")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) console.error("Error fetching about contents:", error)
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const uploadPhoto = async (file) => {
    const fileName = `about-photo-${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from("about-images")
      .upload(fileName, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage
      .from("about-images")
      .getPublicUrl(fileName)
    return data.publicUrl
  }

  const uploadCv = async (file) => {
    const fileName = `about-cv-${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from("about-cv")
      .upload(fileName, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from("about-cv").getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleCreate = async (form, photoFile, cvFileEn, cvFileId) => {
    setUploading(true)
    try {
      const photoUrl = photoFile ? await uploadPhoto(photoFile) : ""
      const cvUrlEn = cvFileEn ? await uploadCv(cvFileEn) : ""
      const cvUrlId = cvFileId ? await uploadCv(cvFileId) : ""
      if (form.is_published) {
        await supabase
          .from("about_contents")
          .update({ is_published: false })
          .eq("is_published", true)
      }
      await supabase.from("about_contents").insert({
        name: form.name,
        description: form.description,
        quote: form.quote,
        role_badges: form.role_badges,
        photo_url: photoUrl,
        cv_en_url: cvUrlEn,
        cv_id_url: cvUrlId,
        is_published: form.is_published,
        version: 1,
      })
      setShowCreate(false)
      pushToast("success", "About content created successfully!")
      fetchItems()
    } catch (err) {
      console.error(err)
      pushToast("error", err.message || "Failed to save about content")
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = async (form, photoFile, cvFileEn, cvFileId) => {
    if (!editItem) return
    setUploading(true)
    try {
      const photoUrl = photoFile
        ? await uploadPhoto(photoFile)
        : editItem.photo_url || ""
      const cvUrlEn = cvFileEn
        ? await uploadCv(cvFileEn)
        : editItem.cv_en_url || ""
      const cvUrlId = cvFileId
        ? await uploadCv(cvFileId)
        : editItem.cv_id_url || ""
      if (form.is_published) {
        await supabase
          .from("about_contents")
          .update({ is_published: false })
          .neq("id", editItem.id)
          .eq("is_published", true)
      }
      await supabase
        .from("about_contents")
        .update({
          name: form.name,
          description: form.description,
          quote: form.quote,
          role_badges: form.role_badges,
          photo_url: photoUrl,
          cv_en_url: cvUrlEn,
          cv_id_url: cvUrlId,
          is_published: form.is_published,
          version: (editItem.version || 1) + 1,
        })
        .eq("id", editItem.id)
      setEditItem(null)
      pushToast("success", "About content updated successfully!")
      fetchItems()
    } catch (err) {
      console.error(err)
      pushToast("error", err.message || "Failed to update about content")
    } finally {
      setUploading(false)
    }
  }

  const deleteItem = async (id) => {
    if (!confirm("Delete this about content?")) return
    const { error } = await supabase
      .from("about_contents")
      .delete()
      .eq("id", id)
    if (error) {
      pushToast("error", error.message || "Failed to delete")
      return
    }
    pushToast("success", "About content deleted!")
    fetchItems()
  }

  const togglePublish = async (item) => {
    if (item.is_published) {
      await supabase
        .from("about_contents")
        .update({ is_published: false })
        .eq("id", item.id)
    } else {
      await supabase
        .from("about_contents")
        .update({ is_published: false })
        .neq("id", item.id)
        .eq("is_published", true)
      await supabase
        .from("about_contents")
        .update({ is_published: true })
        .eq("id", item.id)
    }
    pushToast("success", item.is_published ? "Unpublished!" : "Published!")
    fetchItems()
  }

  const handleViewCv = async (cvUrl) => {
    try {
      let path = cvUrl
      if (cvUrl.includes("/about-cv/")) {
        path = cvUrl.split("/about-cv/").slice(1).join("/about-cv/")
      }
      path = decodeURIComponent(path)

      const { data, error } = await supabase.storage
        .from("about-cv")
        .createSignedUrl(path, 3600)
      if (error) {
        console.error("Error creating signed URL:", error)
        window.open(cvUrl, "_blank")
        return
      }
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank")
      }
    } catch (err) {
      console.error("Failed to view CV:", err)
      window.open(cvUrl, "_blank")
    }
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
