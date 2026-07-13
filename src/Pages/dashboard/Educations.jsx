import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { supabase } from "../../config/supabase"
import {
  GraduationCap,
  Pencil,
  Trash2,
  Sparkles,
  Calendar,
  CheckCircle2,
  Building2,
  X,
  BookOpen,
} from "lucide-react"
import {
  normalizeEducation,
  compareEducationTimeline,
  formatDateRange,
} from "../../utils/educations"
import AddNewButton from "./components/AddNewButton"

/* ── Helpers ── */
const getInitials = (school = "") =>
  school
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR + 5 - i)

const validateEducationForm = (form) => {
  const errors = {}

  if (!String(form.school || "").trim()) {
    errors.school = "School wajib diisi."
  }

  if (!String(form.degree || "").trim()) {
    errors.degree = "Degree wajib diisi."
  }

  if (!form.start_year) {
    errors.start_year = "Start year wajib diisi."
  }

  if (!form.is_current) {
    if (!form.end_year) {
      errors.end_year = "End year wajib diisi jika ini bukan current education."
    }
  }

  return errors
}

const FieldError = ({ message }) =>
  message ? <p className="mt-2 text-sm text-red-400">{message}</p> : null

/* ── Modal wrapper ── */
const Modal = ({ title, onClose, children }) =>
  createPortal(
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
              className="cursor-target p-1 text-gray-500 hover:text-white transition-colors"
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

/* ── Inline Education Form ── */
const EducationForm = ({ initial = null, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState({
    school: initial?.school ?? "",
    degree: initial?.degree ?? "",
    field_of_study: initial?.field_of_study ?? "",
    start_month: initial?.start_month ?? "",
    start_year: initial?.start_year ?? CURRENT_YEAR,
    end_month: initial?.end_month ?? "",
    end_year: initial?.end_year ?? CURRENT_YEAR,
    is_current: initial?.is_current ?? false,
    grade: initial?.grade ?? "",
    activities: initial?.activities ?? "",
    description: initial?.description ?? "",
  })
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

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = validateEducationForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload = {
      ...form,
      start_month: form.start_month ? parseInt(form.start_month) : null,
      start_year: form.start_year ? parseInt(form.start_year) : null,
      end_month: form.is_current
        ? null
        : form.end_month
          ? parseInt(form.end_month)
          : null,
      end_year: form.is_current
        ? null
        : form.end_year
          ? parseInt(form.end_year)
          : null,
    }
    onSubmit(payload)
  }

  const sectionTitle = (icon, text) => (
    <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest my-2 pt-2">
      <div className="flex-1 h-px bg-white/6" />
      <span className="flex items-center gap-1.5">
        {icon} {text}
      </span>
      <div className="flex-1 h-px bg-white/6" />
    </div>
  )

  const labelCls =
    "text-xs text-indigo-300/70 uppercase tracking-wider font-medium"
  const inputCls =
    "cursor-target w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
  const selectCls = inputCls + " cursor-pointer"

  const getInputClass = (field) =>
    `${inputCls} ${errors[field] ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20" : ""}`

  const getSelectClass = (field, extraClass = "") =>
    `${selectCls} ${errors[field] ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20" : ""} ${extraClass}`.trim()

  return (
    <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-5">
      {sectionTitle(<GraduationCap className="w-3 h-3" />, "School & Degree")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className={labelCls}>School / University *</label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={form.school}
              onChange={set("school")}
              placeholder="e.g. Universitas Teknologi Bandung"
              className={`${getInputClass("school")} pl-10`}
            />
          </div>
          <FieldError message={errors.school} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Degree *</label>
          <input
            type="text"
            value={form.degree}
            onChange={set("degree")}
            placeholder="e.g. Bachelor of Science"
            className={getInputClass("degree")}
          />
          <FieldError message={errors.degree} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Field of Study</label>
          <input
            type="text"
            value={form.field_of_study}
            onChange={set("field_of_study")}
            placeholder="e.g. Computer Science"
            className={getInputClass("field_of_study")}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Grade / GPA</label>
          <input
            type="text"
            value={form.grade}
            onChange={set("grade")}
            placeholder="e.g. 3.8 / 4.0"
            className={getInputClass("grade")}
          />
        </div>
      </div>

      {sectionTitle(<Calendar className="w-3 h-3" />, "Timeline")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelCls}>Start Month</label>
          <select
            value={form.start_month}
            onChange={set("start_month")}
            className={getSelectClass("start_month")}
          >
            <option value="">Select month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={labelCls}>Start Year *</label>
          <select
            value={form.start_year}
            onChange={set("start_year")}
            className={getSelectClass("start_year")}
          >
            <option value="">Select year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <FieldError message={errors.start_year} />
        </div>
        <div className="space-y-1.5">
          <label
            className={`${labelCls} ${form.is_current ? "opacity-40" : ""}`}
          >
            End Month
          </label>
          <select
            value={form.end_month}
            onChange={set("end_month")}
            disabled={form.is_current}
            className={getSelectClass(
              "end_month",
              form.is_current ? "opacity-40 cursor-not-allowed" : ""
            )}
          >
            <option value="">Select month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label
            className={`${labelCls} ${form.is_current ? "opacity-40" : ""}`}
          >
            End Year
          </label>
          <select
            value={form.end_year}
            onChange={set("end_year")}
            disabled={form.is_current}
            className={getSelectClass(
              "end_year",
              form.is_current ? "opacity-40 cursor-not-allowed" : ""
            )}
          >
            <option value="">Select year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <FieldError message={!form.is_current ? errors.end_year : ""} />
        </div>

        {/* Modern Toggle for Currently Studying Here */}
        <div className="sm:col-span-2 mt-1">
          <label className="cursor-target flex items-center gap-3 cursor-pointer group w-fit p-1 -ml-1">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${form.is_current ? "bg-indigo-500" : "bg-white/10"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${form.is_current ? "translate-x-5" : "translate-x-0"}`}
              />
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={form.is_current}
              onChange={(e) => {
                setForm((f) => ({
                  ...f,
                  is_current: e.target.checked,
                  end_month: "",
                  end_year: "",
                }))
                if (e.target.checked) {
                  setErrors((current) => {
                    const next = { ...current }
                    delete next.end_month
                    delete next.end_year
                    return next
                  })
                }
              }}
            />
            <span
              className={`text-sm transition-colors ${form.is_current ? "text-white font-medium" : "text-gray-400 group-hover:text-gray-300"}`}
            >
              I currently study here
            </span>
          </label>
        </div>
      </div>

      {sectionTitle(<BookOpen className="w-3 h-3" />, "Details & Activities")}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className={labelCls}>Activities and Societies</label>
          <textarea
            value={form.activities}
            onChange={set("activities")}
            placeholder="e.g. Student Council, Programming Club, Volleyball Team"
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelCls}>Description</label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="Describe your achievements and notable coursework..."
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {/* Buttons */}
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
          disabled={submitting}
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
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <GraduationCap className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-sm font-medium text-gray-200">
              {submitting
                ? "Saving..."
                : initial
                  ? "Update Education"
                  : "Save Education"}
            </span>
          </div>
        </button>
      </div>
    </form>
  )
}

/* ── Skeleton ── */
const SkeletonRow = () => (
  <div className="flex gap-4 sm:gap-6 animate-pulse">
    <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8" />
      <div className="w-0.5 flex-1 bg-white/5 min-h-[60px]" />
    </div>
    <div className="flex-1 pb-8">
      <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-5 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/5 rounded-lg w-1/3" />
            <div className="h-3 bg-white/5 rounded-lg w-1/4" />
          </div>
          <div className="h-6 w-20 bg-white/5 rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="h-7 w-32 bg-white/5 rounded-lg" />
          <div className="h-7 w-20 bg-white/5 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
)

/* ── Premium Education Card ── */
const EducationCard = ({ education, onEdit, onDelete, isLast }) => {
  const [hovered, setHovered] = useState(false)
  const initials = getInitials(education.school)
  const dateRange = formatDateRange(
    education.start_month,
    education.start_year,
    education.end_month,
    education.end_year,
    education.is_current
  )

  return (
    <div className="flex gap-4 sm:gap-6">
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`relative w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${education.is_current ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300" : "bg-white/5 border-white/12 text-gray-400"} ${hovered ? "scale-110 shadow-lg shadow-indigo-500/20" : ""}`}
        >
          {initials || <Building2 className="w-4 h-4" />}
          {education.is_current && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a1a]">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          )}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-2 min-h-[48px]"
            style={{
              background: hovered
                ? "linear-gradient(to bottom, rgba(99,102,241,0.4), transparent)"
                : "rgba(255,255,255,0.06)",
              transition: "background 0.4s",
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 pb-6 group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="relative rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
          style={{
            boxShadow: hovered ? "0 0 32px -8px rgba(99,102,241,0.2)" : "none",
          }}
        >
          {/* Top glow */}
          <div
            className="absolute inset-x-0 top-0 h-px transition-opacity duration-500"
            style={{
              opacity: hovered ? 1 : 0,
              background:
                "linear-gradient(90deg, transparent, var(--color-primary-light), transparent)",
            }}
          />

          <div className="p-5 flex flex-col gap-4">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-white text-base leading-tight group-hover:text-indigo-100 transition-colors duration-300">
                    {education.school}
                  </h3>
                  {education.is_current && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Current
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                  <span className="font-medium text-gray-300">
                    {education.degree}{" "}
                    {education.field_of_study
                      ? `in ${education.field_of_study}`
                      : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Date + Grade */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 border border-white/8 rounded-lg px-3 py-1.5">
                <Calendar className="w-3 h-3 text-gray-600" />
                <span>{dateRange}</span>
              </div>
              {education.grade && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 border border-white/8 rounded-lg px-3 py-1.5">
                  <Sparkles className="w-3 h-3 text-gray-600" />
                  <span>Grade: {education.grade}</span>
                </div>
              )}
            </div>

            {/* Activities preview */}
            {education.activities && (
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 border-l-2 border-white/8 pl-3 group-hover:border-indigo-500/30 transition-colors duration-300">
                <strong className="text-gray-300">Activities:</strong>{" "}
                {education.activities}
              </p>
            )}

            {/* Description preview */}
            {education.description && (
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 border-l-2 border-white/8 pl-3 group-hover:border-indigo-500/30 transition-colors duration-300">
                {education.description
                  .split("\n")
                  .map((l) => l.replace(/^[-•–]\s+/, "").trim())
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/6">
              <span className="text-[10px] text-gray-600 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> Educational Record
              </span>
              <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  type="button"
                  onClick={() => onEdit(education)}
                  className="cursor-target flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 text-xs font-medium transition-all"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(education.id)}
                  className="cursor-target flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 text-xs font-medium transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function Educations() {
  const [educations, setEducations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editEducation, setEditEducation] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchEducations = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("educations").select("*")
    if (error) {
      console.error("Failed to fetch:", error)
      setEducations([])
      setLoading(false)
      return
    }
    const normalized = (data || [])
      .map(normalizeEducation)
      .sort(compareEducationTimeline)
    setEducations(normalized)
    setLoading(false)
  }

  useEffect(() => {
    fetchEducations()
  }, [])

  const handleCreate = async (payload) => {
    setSubmitting(true)
    const { error } = await supabase.from("educations").insert([payload])
    setSubmitting(false)
    if (error) {
      console.error("Failed to create:", error)
      alert(
        `Gagal menyimpan ke database: ${error.message || error.details || "Unknown error"}`
      )
      return
    }
    setShowCreate(false)
    fetchEducations()
  }

  const handleEdit = async (payload) => {
    if (!editEducation) return
    setSubmitting(true)
    const { error } = await supabase
      .from("educations")
      .update(payload)
      .eq("id", editEducation.id)
    setSubmitting(false)
    if (error) {
      console.error("Failed to update:", error)
      alert(
        `Gagal mengupdate ke database: ${error.message || error.details || "Unknown error"}`
      )
      return
    }
    setEditEducation(null)
    fetchEducations()
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this education history?")) return
    const { error } = await supabase.from("educations").delete().eq("id", id)
    if (error) {
      console.error("Failed to delete:", error)
      return
    }
    fetchEducations()
  }

  const currentCount = educations.filter((e) => e.is_current).length

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
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
              <GraduationCap className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Educational History
            </h1>
            {!loading && (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">
                  <GraduationCap className="w-3 h-3" /> {educations.length}{" "}
                  records
                </span>
                {currentCount > 0 && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                    <CheckCircle2 className="w-3 h-3" /> {currentCount} current
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <AddNewButton
          onClick={() => {
            setShowCreate(true)
            setEditEducation(null)
          }}
          label="Add Education"
        />
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <Modal title="Add New Education" onClose={() => setShowCreate(false)}>
          <EducationForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitting={submitting}
          />
        </Modal>
      )}
      {editEducation && (
        <Modal title="Edit Education" onClose={() => setEditEducation(null)}>
          <EducationForm
            initial={editEducation}
            onSubmit={handleEdit}
            onCancel={() => setEditEducation(null)}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="space-y-0 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : educations.length === 0 ? (
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
                No education history yet
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Add your first educational record
              </p>
            </div>
            <div className="mt-2">
              <AddNewButton
                onClick={() => setShowCreate(true)}
                label="Add Education"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <div className="space-y-0">
            {educations.map((edu, index) => (
              <EducationCard
                key={edu.id}
                education={edu}
                onEdit={(e) => {
                  setEditEducation(e)
                  setShowCreate(false)
                }}
                onDelete={handleDelete}
                isLast={index === educations.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
