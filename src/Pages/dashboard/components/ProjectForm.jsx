import { useEffect, useState } from "react"
import {
  Upload,
  FolderGit2,
  X,
  ImageIcon,
  ExternalLink,
  Github,
  List,
  Globe,
  Layers,
  Zap,
} from "lucide-react"
import {
  MAX_PROJECT_IMAGES,
  normalizeProjectImages,
} from "../../../utils/projectImages"
import { validateProjectForm } from "./projectHelpers.jsx"

const sectionTitle = (icon, text) => (
  <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest my-2 pt-2 sm:col-span-2">
    <div className="flex-1 h-px bg-white/6" />
    <span className="flex items-center gap-1.5">
      {icon} {text}
    </span>
    <div className="flex-1 h-px bg-white/6" />
  </div>
)

export default function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Project",
  uploading,
}) {
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [imageItems, setImageItems] = useState(() =>
    normalizeProjectImages(initial).map((url, index) => ({
      id: `existing-${index}-${url}`,
      url,
      file: null,
    }))
  )
  const [form, setForm] = useState({
    title: initial?.title || initial?.Title || "",
    category: initial?.category || initial?.Category || "",
    description: initial?.description || initial?.Description || "",
    techstack: Array.isArray(initial?.tech_stack)
      ? initial.tech_stack.join(",")
      : Array.isArray(initial?.techstack)
        ? initial.techstack.join(",")
        : Array.isArray(initial?.TechStack)
          ? initial.TechStack.join(",")
          : initial?.techstack ||
            initial?.TechStack ||
            initial?.tech_stack ||
            "",
    features: Array.isArray(initial?.features)
      ? initial.features.join(",")
      : Array.isArray(initial?.Features)
        ? initial.Features.join(",")
        : initial?.features || initial?.Features || "",
    link: initial?.link || initial?.Link || "",
    github: initial?.github || initial?.Github || "",
  })

  const set = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setTouched((current) => ({ ...current, [key]: true }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const markTouched = (key) => () => {
    setTouched((current) => ({ ...current, [key]: true }))
  }

  const getFieldError = (key) =>
    touched[key] || errors[key] ? errors[key] : ""

  useEffect(() => {
    if (Object.keys(touched).length === 0) return
    setErrors(validateProjectForm(form, imageItems))
  }, [form, imageItems, touched])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const availableSlots = MAX_PROJECT_IMAGES - imageItems.length
    if (availableSlots <= 0) {
      alert(`Maximum ${MAX_PROJECT_IMAGES} images allowed.`)
      e.target.value = ""
      return
    }

    const acceptedFiles = files.slice(0, availableSlots)
    const nextItems = acceptedFiles.map((file) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      url: URL.createObjectURL(file),
      file,
    }))

    setImageItems((current) => [...current, ...nextItems])
    setTouched((current) => ({ ...current, images: true }))
    setErrors((current) => {
      if (!current.images) return current
      const next = { ...current }
      delete next.images
      return next
    })
    e.target.value = ""
  }

  const removeImage = (id) => {
    setImageItems((current) => {
      const target = current.find((item) => item.id === id)
      if (target?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(target.url)
      }
      return current.filter((item) => item.id !== id)
    })
    setTouched((current) => ({ ...current, images: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateProjectForm(form, imageItems)
    setTouched({
      title: true,
      category: true,
      link: true,
      github: true,
      images: true,
    })
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidKey = Object.keys(nextErrors)[0]
      const fieldSelectorMap = {
        title: '[data-project-field="title"]',
        category: '[data-project-field="category"]',
        link: '[data-project-field="link"]',
        github: '[data-project-field="github"]',
        images: '[data-project-field="images"]',
      }
      const targetField = document.querySelector(
        fieldSelectorMap[firstInvalidKey]
      )
      targetField?.scrollIntoView?.({ behavior: "smooth", block: "center" })
      return
    }

    onSubmit(form, imageItems)
  }

  const inputCls =
    "cursor-target w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
  const labelCls =
    "text-xs text-indigo-300/70 uppercase tracking-wider font-medium"

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sectionTitle(<FolderGit2 className="w-3 h-3" />, "Basic Info")}

        <div className="sm:col-span-2 space-y-1.5">
          <label className={labelCls}>Project Title *</label>
          <input
            data-project-field="title"
            type="text"
            value={form.title}
            onChange={set("title")}
            onBlur={markTouched("title")}
            placeholder="e.g. My Portfolio Website"
            required
            aria-invalid={Boolean(getFieldError("title"))}
            className={`${inputCls} ${getFieldError("title") ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20" : ""}`}
          />
          {getFieldError("title") && (
            <p className="text-xs text-red-300">{getFieldError("title")}</p>
          )}
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className={labelCls}>Category *</label>
          <select
            data-project-field="category"
            value={form.category}
            onChange={set("category")}
            onBlur={markTouched("category")}
            required
            aria-invalid={Boolean(getFieldError("category"))}
            className={`${inputCls} appearance-none ${getFieldError("category") ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20" : ""}`}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Internet of Things (IoT)">
              Internet of Things (IoT)
            </option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Desktop Application">Desktop Application</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Other">Other</option>
          </select>
          {getFieldError("category") && (
            <p className="text-xs text-red-300">{getFieldError("category")}</p>
          )}
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className={labelCls}>Description</label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="Describe what this project does, its purpose, and impact..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>

        {sectionTitle(<Zap className="w-3 h-3" />, "Tech & Features")}

        <div className="space-y-1.5">
          <label className={labelCls}>Tech Stack</label>
          <div className="relative">
            <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={form.techstack}
              onChange={set("techstack")}
              placeholder="e.g. React, Tailwind, Supabase"
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Key Features</label>
          <div className="relative">
            <List className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={form.features}
              onChange={set("features")}
              placeholder="e.g. Auth, Dark mode"
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        {sectionTitle(<ExternalLink className="w-3 h-3" />, "Links")}

        <div className="space-y-1.5">
          <label className={labelCls}>Live URL</label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              data-project-field="link"
              type="url"
              value={form.link}
              onChange={set("link")}
              onBlur={markTouched("link")}
              placeholder="https://yourproject.com"
              aria-invalid={Boolean(getFieldError("link"))}
              className={`${inputCls} pl-10 ${getFieldError("link") ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20" : ""}`}
            />
          </div>
          {getFieldError("link") ? (
            <p className="text-xs text-red-300">{getFieldError("link")}</p>
          ) : (
            <p className="text-[11px] text-gray-500">
              Opsional, tapi jika diisi harus link valid dengan http:// atau
              https://.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>GitHub URL</label>
          <div className="relative">
            <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              data-project-field="github"
              type="url"
              value={form.github}
              onChange={set("github")}
              onBlur={markTouched("github")}
              placeholder="https://github.com/username/repo"
              aria-invalid={Boolean(getFieldError("github"))}
              className={`${inputCls} pl-10 ${getFieldError("github") ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20" : ""}`}
            />
          </div>
          {getFieldError("github") ? (
            <p className="text-xs text-red-300">{getFieldError("github")}</p>
          ) : (
            <p className="text-[11px] text-gray-500">
              Opsional, tapi jika diisi harus link valid dengan http:// atau
              https://.
            </p>
          )}
        </div>

        {sectionTitle(<ImageIcon className="w-3 h-3" />, "Media")}

        <div className="sm:col-span-2 space-y-1.5">
          <label className={labelCls}>
            Project Images (max {MAX_PROJECT_IMAGES}) *
          </label>
          <div className="space-y-3">
            <label
              data-project-field="images"
              className={`cursor-target flex items-center gap-4 w-full bg-[#0d0d22] border border-dashed rounded-xl px-4 py-4 cursor-pointer transition-all ${getFieldError("images") ? "border-red-500/50 hover:border-red-400/70 bg-red-500/5" : "border-white/15 hover:border-indigo-500/40 hover:bg-white/4"}`}
            >
              {imageItems.length > 0 ? (
                <div className="flex -space-x-3">
                  {imageItems.slice(0, 3).map((item) => (
                    <img
                      key={item.id}
                      src={item.url}
                      className="h-16 w-24 object-cover rounded-lg border border-white/10 ring-2 ring-[#0d0d22]"
                      alt="preview"
                    />
                  ))}
                  {imageItems.length > 3 && (
                    <div className="h-16 w-16 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-xs text-gray-300 ring-2 ring-[#0d0d22]">
                      +{imageItems.length - 3}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-24 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div>
                <p className="text-sm text-gray-300">
                  {imageItems.length > 0
                    ? "Add more images"
                    : "Click to upload images"}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  PNG, JPG, WEBP supported. Minimal 1 image wajib.
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={imageItems.length >= MAX_PROJECT_IMAGES}
              />
            </label>

            {getFieldError("images") && (
              <p className="text-xs text-red-300">{getFieldError("images")}</p>
            )}

            {imageItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imageItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 group/img"
                  >
                    <img
                      src={item.url}
                      alt={`Project preview ${index + 1}`}
                      className="h-28 w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#0f172a] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                    <div className="absolute left-2 top-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white border border-white/10 shadow-sm">
                      {index === 0 ? "Primary" : `#${index + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      className="cursor-target absolute right-2 top-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm no-neo"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
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
              <Upload className="w-4 h-4 text-indigo-400" />
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
