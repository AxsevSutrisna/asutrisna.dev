import { useEffect, useState, useCallback } from "react"
import ReactDOM from "react-dom"
import { supabase } from "../../config/supabase"
import { useToast } from "../../hooks/useToast"
import ToastStack from "../../components/ToastStack"
import {
  Plus,
  Trash2,
  Upload,
  BookOpen,
  X,
  ImageIcon,
  Pencil,
  Building,
  Calendar,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react"
import AddNewButton from "./components/AddNewButton"

const FieldError = ({ message }) =>
  message ? <p className="mt-2 text-sm text-red-400">{message}</p> : null

// Modal Component
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
        <div
          className="relative border border-white/12 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ backgroundColor: "var(--color-backdrop-base)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0 bg-white/5">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="cursor-target p-1 text-gray-500 hover:text-white transition-colors no-neo"
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

// Course Form
const CourseForm = ({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Course",
  uploading,
}) => {
  const [form, setForm] = useState({
    title: initial?.title || "",
    provider: initial?.provider || "",
    completion_date: initial?.completion_date || "",
    certificate_link: initial?.certificate_link || "",
    description: initial?.description || "",
  })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(initial?.img_url || null)
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = "Course Title wajib diisi."
    if (!form.provider.trim()) nextErrors.provider = "Provider wajib diisi."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit(form, file)
  }

  const inputCls =
    "cursor-target w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-white/20 transition-all"
  const labelCls = "text-xs uppercase tracking-wider font-medium mb-1.5 block"

  const getInputClass = (field) =>
    `${inputCls} ${errors[field] ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20" : ""}`

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="sm:col-span-2">
          <label
            className={labelCls}
            style={{ color: "var(--color-primary-light)" }}
          >
            Course Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Fullstack React Developer"
            className={getInputClass("title")}
          />
          <FieldError message={errors.title} />
        </div>

        {/* Provider */}
        <div>
          <label
            className={labelCls}
            style={{ color: "var(--color-primary-light)" }}
          >
            Provider *
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={form.provider}
              onChange={set("provider")}
              placeholder="e.g. Coursera, Udemy"
              className={`${getInputClass("provider")} pl-10`}
            />
          </div>
          <FieldError message={errors.provider} />
        </div>

        {/* Date */}
        <div>
          <label
            className={labelCls}
            style={{ color: "var(--color-primary-light)" }}
          >
            Completion Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={form.completion_date}
              onChange={set("completion_date")}
              className={`${inputCls} pl-10 [color-scheme:dark]`}
            />
          </div>
        </div>

        {/* Link */}
        <div className="sm:col-span-2">
          <label
            className={labelCls}
            style={{ color: "var(--color-primary-light)" }}
          >
            Certificate Link (URL)
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="url"
              value={form.certificate_link}
              onChange={set("certificate_link")}
              placeholder="https://credential.net/..."
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label
            className={labelCls}
            style={{ color: "var(--color-primary-light)" }}
          >
            Description
          </label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="What did you learn in this course?"
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Image */}
        <div className="sm:col-span-2">
          <label
            className={labelCls}
            style={{ color: "var(--color-primary-light)" }}
          >
            Course Image / Badge
          </label>
          <div className="flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-xl border border-white/10"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <label className="cursor-target px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer text-sm text-white transition-colors no-neo">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
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
          className="cursor-target relative group/btn"
        >
          <div
            className="absolute -inset-0.5 rounded-xl opacity-60 blur group-hover/btn:opacity-100 transition duration-300"
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
              <Upload
                className="w-4 h-4 text-indigo-400"
                style={{ color: "var(--color-primary-light)" }}
              />
            )}
            <span className="text-sm font-medium text-gray-200">
              {uploading ? "Saving..." : submitLabel}
            </span>
          </div>
        </button>
      </div>
    </form>
  )
}

// Skeleton Row
const SkeletonRow = () => (
  <div className="flex gap-4 sm:gap-6 animate-pulse w-full mb-4">
    <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/8 shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-4 bg-white/5 rounded-lg w-1/3" />
      <div className="h-3 bg-white/5 rounded-lg w-1/4" />
    </div>
  </div>
)

// Course Card
const CourseCard = ({ course, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? "0 8px 32px -8px var(--color-primary-dark)"
          : "none",
        borderColor: hovered
          ? "var(--color-primary-dark)"
          : "rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "linear-gradient(90deg, transparent, var(--color-primary-light), transparent)",
        }}
      />

      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/8 shrink-0 flex items-center justify-center relative">
        {course.img_url ? (
          <img
            src={course.img_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="w-6 h-6 text-gray-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className="text-sm font-semibold text-white truncate group-hover:text-indigo-100 transition-colors"
          style={{ color: hovered ? "var(--color-primary-light)" : "white" }}
        >
          {course.title}
        </h3>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {course.provider}
        </p>
        {course.completion_date && (
          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {course.completion_date}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onEdit(course)}
          className="cursor-target p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white transition-colors no-neo border border-white/10 hover:border-white/20"
          style={{
            backgroundColor: hovered
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.05)",
          }}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="cursor-target p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors no-neo border border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { toasts, pushToast, removeToast } = useToast()

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) {
      console.error(error)
      pushToast("error", "Failed to fetch courses.")
    } else {
      setCourses(data || [])
    }
    setLoading(false)
  }, [pushToast])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const uploadImage = async (file) => {
    const fileName = `course-${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("course-images")
      .upload(fileName, file)
    if (uploadError) throw uploadError
    const { data } = supabase.storage
      .from("course-images")
      .getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleCreate = async (form, file) => {
    setUploading(true)
    try {
      let img_url = null
      if (file) {
        img_url = await uploadImage(file)
      }

      const { error } = await supabase
        .from("courses")
        .insert([{ ...form, img_url }])
      if (error) throw error

      pushToast("success", "Course added successfully!")
      setShowCreate(false)
      fetchCourses()
    } catch (err) {
      console.error(err)
      pushToast("error", "Failed to create course.")
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (form, file) => {
    setUploading(true)
    try {
      let img_url = editCourse.img_url
      if (file) {
        img_url = await uploadImage(file)
      }

      const { error } = await supabase
        .from("courses")
        .update({ ...form, img_url })
        .eq("id", editCourse.id)
      if (error) throw error

      pushToast("success", "Course updated successfully!")
      setEditCourse(null)
      fetchCourses()
    } catch (err) {
      console.error(err)
      pushToast("error", "Failed to update course.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id)
      if (error) throw error
      pushToast("success", "Course deleted successfully!")
      fetchCourses()
    } catch (err) {
      console.error(err)
      pushToast("error", "Failed to delete course.")
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              <BookOpen
                className="w-5 h-5 text-indigo-400"
                style={{ color: "var(--color-primary-light)" }}
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Courses
            </h1>
            <p className="text-sm text-gray-400">
              Manage your educational courses and bootcamp certificates
            </p>
          </div>
        </div>
        <AddNewButton onClick={() => setShowCreate(true)} label="Add Course" />
      </div>

      {/* ── Content ── */}
      <div className="pt-2">
        {loading ? (
          <div className="space-y-0 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="relative rounded-2xl border border-white/8 border-dashed overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at center, var(--color-primary-dark) 0%, transparent 70%)",
              }}
            />
            <div className="relative py-24 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-gray-300 font-medium text-sm">
                  No courses found
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Add your first course to show on your portfolio.
                </p>
              </div>
              <div className="mt-2">
                <AddNewButton
                  onClick={() => setShowCreate(true)}
                  label="Add First Course"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={setEditCourse}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Add New Course" onClose={() => setShowCreate(false)}>
          <CourseForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            uploading={uploading}
            submitLabel="Create Course"
          />
        </Modal>
      )}

      {editCourse && (
        <Modal title="Edit Course" onClose={() => setEditCourse(null)}>
          <CourseForm
            initial={editCourse}
            onSubmit={handleUpdate}
            onCancel={() => setEditCourse(null)}
            uploading={uploading}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}
