import { useState } from "react"
import {
  Upload,
  ImageIcon,
  FileText,
  Eye,
  Sparkles,
  Quote,
  CheckCircle2,
  User,
} from "lucide-react"
import { validateAboutForm, FieldError } from "./aboutHelpers.jsx"

export default function AboutForm({
  initial,
  onSubmit,
  onCancel,
  uploading,
  onViewCv,
}) {
  const isEditing = Boolean(initial)
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    quote: initial?.quote ?? "",
    role_badges: initial?.role_badges ?? "",
    is_published: initial?.is_published ?? true,
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [cvFileEn, setCvFileEn] = useState(null)
  const [cvFileId, setCvFileId] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(
    isEditing ? initial?.photo_url || null : null
  )
  const [cvLabelEn, setCvLabelEn] = useState(
    isEditing && initial?.cv_en_url ? initial.cv_en_url.split("/").pop() : null
  )
  const [cvLabelId, setCvLabelId] = useState(
    isEditing && initial?.cv_id_url ? initial.cv_id_url.split("/").pop() : null
  )
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setErrors((current) => {
      if (!current.photo) return current
      const next = { ...current }
      delete next.photo
      return next
    })
  }

  const handleCvEnChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCvFileEn(file)
    setCvLabelEn(file.name)
    setErrors((current) => {
      if (!current.cv) return current
      const next = { ...current }
      delete next.cv
      return next
    })
  }

  const handleCvIdChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCvFileId(file)
    setCvLabelId(file.name)
    setErrors((current) => {
      if (!current.cv) return current
      const next = { ...current }
      delete next.cv
      return next
    })
  }

  const inputCls =
    "cursor-target w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
  const labelCls =
    "text-xs text-indigo-300/70 uppercase tracking-wider font-medium"
  const getInputClass = (field) =>
    `${inputCls} ${errors[field] ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20" : ""}`

  const getUploadClass = (field) =>
    `cursor-target flex items-center gap-4 w-full bg-[#0d0d22] border rounded-xl px-4 py-3.5 cursor-pointer transition-all group/cv ${
      errors[field]
        ? "border-red-500/50 hover:border-red-500/70"
        : "border-dashed border-white/12 hover:border-indigo-500/40 hover:bg-white/3"
    }`

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = validateAboutForm(
      form,
      photoFile,
      cvFileEn,
      cvFileId,
      initial
    )
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    onSubmit(form, photoFile, cvFileEn, cvFileId)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-5">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest">
          <div className="flex-1 h-px bg-white/6" />
          <span className="flex items-center gap-1.5">
            <User className="w-3 h-3" /> Identity
          </span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        <div className="flex gap-4 items-start">
          <div className="space-y-1.5 shrink-0">
            <label className="cursor-target relative shrink-0 cursor-pointer group/photo block">
              <div
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed transition-colors bg-white/5 ${errors.photo ? "border-red-500/50 group-hover/photo:border-red-500/70" : "border-white/15 group-hover/photo:border-indigo-500/50"}`}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <ImageIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-[9px] text-gray-600 text-center leading-tight">
                      Upload
                      <br />
                      Photo
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photoFile && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0a0a1a] flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </label>
            <FieldError message={errors.photo} />
          </div>

          <div className="flex-1 space-y-1.5">
            <label className={labelCls}>Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Asep Sutrisna"
              className={getInputClass("name")}
            />
            <p className="text-[10px] text-gray-600">
              Displayed as the main heading on your About page
            </p>
            <FieldError message={errors.name} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest">
          <div className="flex-1 h-px bg-white/6" />
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Content
          </span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Bio / Description *</label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="Describe yourself — your skills, experience, and what drives you..."
            rows={5}
            className={getInputClass("description") + " resize-none"}
          />
          <p className="text-[10px] text-gray-600">
            {form.description.length} characters
          </p>
          <FieldError message={errors.description} />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Personal Quote</label>
          <div className="relative">
            <Quote className="absolute left-3 top-3 w-4 h-4 text-indigo-500/40 pointer-events-none" />
            <textarea
              value={form.quote}
              onChange={set("quote")}
              placeholder="A short quote that defines your professional philosophy..."
              rows={2}
              className={inputCls + " resize-none pl-9"}
            />
          </div>
          {form.quote && (
            <div className="rounded-lg bg-indigo-500/8 border border-indigo-500/20 px-3 py-2">
              <p className="text-xs text-indigo-300/80 italic">
                &ldquo;{form.quote}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1.5 mt-4">
          <label className={labelCls}>Role Badges</label>
          <input
            type="text"
            value={form.role_badges}
            onChange={set("role_badges")}
            placeholder="e.g. DEVELOPER, EDUCATOR, MENTOR"
            className={getInputClass("role_badges")}
          />
          <p className="text-[10px] text-gray-600">
            Separate multiple badges with commas (,)
          </p>
          <FieldError message={errors.role_badges} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest">
          <div className="flex-1 h-px bg-white/6" />
          <span className="flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> Files
          </span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>CV / Resume (English)</label>
          <label className={getUploadClass("cv")}>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${cvLabelEn ? "bg-emerald-500/15 border-emerald-500/30" : "bg-white/5 border-white/10 group-hover/cv:border-indigo-500/30"}`}
            >
              <FileText
                className={`w-5 h-5 ${cvLabelEn ? "text-emerald-300" : "text-gray-600"}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 truncate">
                {cvLabelEn ||
                  (isEditing ? "Replace English CV" : "Upload English CV")}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                PDF recommended · Max 10MB
              </p>
            </div>
            {cvLabelEn && (
              <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
            <input
              type="file"
              accept="application/pdf,.doc,.docx"
              onChange={handleCvEnChange}
              className="hidden"
            />
          </label>
          {isEditing && initial?.cv_en_url && !cvFileEn && (
            <button
              type="button"
              onClick={() => onViewCv(initial.cv_en_url)}
              className="cursor-target inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1 no-neo"
            >
              <Eye className="w-3 h-3" /> View current EN CV
            </button>
          )}
        </div>

        <div className="space-y-1.5 mt-4">
          <label className={labelCls}>CV / Resume (Bahasa Indonesia)</label>
          <label className={getUploadClass("cv")}>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${cvLabelId ? "bg-emerald-500/15 border-emerald-500/30" : "bg-white/5 border-white/10 group-hover/cv:border-indigo-500/30"}`}
            >
              <FileText
                className={`w-5 h-5 ${cvLabelId ? "text-emerald-300" : "text-gray-600"}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 truncate">
                {cvLabelId ||
                  (isEditing
                    ? "Replace Indonesian CV"
                    : "Upload Indonesian CV")}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                PDF recommended · Max 10MB
              </p>
            </div>
            {cvLabelId && (
              <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
            <input
              type="file"
              accept="application/pdf,.doc,.docx"
              onChange={handleCvIdChange}
              className="hidden"
            />
          </label>
          <FieldError message={errors.cv} />
          {isEditing && initial?.cv_id_url && !cvFileId && (
            <button
              type="button"
              onClick={() => onViewCv(initial.cv_id_url)}
              className="cursor-target inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1 no-neo"
            >
              <Eye className="w-3 h-3" /> View current ID CV
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/8">
        <div>
          <p className="text-sm font-medium text-gray-200">
            Publish this About page
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Only one record can be published at a time
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setForm((f) => ({ ...f, is_published: !f.is_published }))
          }
          className={`cursor-target relative w-11 h-6 rounded-full border transition-all duration-300 no-neo ${
            form.is_published
              ? "bg-indigo-500 border-indigo-400"
              : "bg-white/10 border-white/15"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
              form.is_published ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-1 border-t border-white/6">
        {Object.keys(errors).length > 0 && (
          <p className="mr-auto self-center text-sm text-red-400">
            Masih ada field wajib yang belum diisi.
          </p>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="cursor-target px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all no-neo"
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
            className="relative flex items-center gap-2 px-5 py-2 rounded-xl border border-white/10"
            style={{ backgroundColor: "var(--color-backdrop-base)" }}
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-sm text-gray-200">
              {uploading
                ? "Saving..."
                : isEditing
                  ? "Update About"
                  : "Save About"}
            </span>
          </div>
        </button>
      </div>
    </form>
  )
}
