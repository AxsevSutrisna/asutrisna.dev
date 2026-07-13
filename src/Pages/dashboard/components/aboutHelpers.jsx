export const formatDate = (dateStr) => {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export const validateAboutForm = (
  form,
  photoFile,
  cvFileEn,
  cvFileId,
  initial
) => {
  const errors = {}

  const hasPhoto = Boolean(photoFile || initial?.photo_url)
  const hasCvEn = Boolean(cvFileEn || initial?.cv_en_url)
  const hasCvId = Boolean(cvFileId || initial?.cv_id_url)

  if (!hasPhoto) {
    errors.photo = "Photo profile wajib diisi."
  }

  if (!String(form.name || "").trim()) {
    errors.name = "Full name wajib diisi."
  }

  if (!String(form.description || "").trim()) {
    errors.description = "Bio wajib diisi."
  }

  if (!hasCvEn && !hasCvId) {
    errors.cv = "Minimal satu CV / Resume wajib diisi."
  }

  return errors
}

export const FieldError = ({ message }) =>
  message ? <p className="mt-2 text-sm text-red-400">{message}</p> : null

export const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/6 overflow-hidden animate-pulse flex flex-col sm:flex-row">
    <div className="w-full sm:w-56 h-48 bg-white/5 shrink-0" />
    <div className="flex-1 p-5 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-white/5 rounded-lg w-36" />
          <div className="h-3 bg-white/5 rounded-lg w-24" />
        </div>
        <div className="flex gap-1.5">
          <div className="w-8 h-8 bg-white/5 rounded-lg" />
          <div className="w-8 h-8 bg-white/5 rounded-lg" />
          <div className="w-8 h-8 bg-white/5 rounded-lg" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-white/5 rounded-lg w-full" />
        <div className="h-3 bg-white/5 rounded-lg w-5/6" />
        <div className="h-3 bg-white/5 rounded-lg w-4/6" />
      </div>
      <div className="h-14 bg-white/5 rounded-xl" />
      <div className="h-8 bg-white/5 rounded-lg w-24" />
    </div>
  </div>
)
