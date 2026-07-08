import { ImageIcon } from "lucide-react"

export const isValidHttpUrl = (value) => {
  if (!value) return false

  try {
    const parsedUrl = new URL(value)
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
  } catch {
    return false
  }
}

export const validateProjectForm = (form, imageItems = []) => {
  const errors = {}
  const title = (form?.title || "").trim()
  const liveUrl = (form?.link || "").trim()
  const githubUrl = (form?.github || "").trim()

  if (!title) {
    errors.title = "Project Title wajib diisi."
  }

  if (!form?.category) {
    errors.category = "Kategori project wajib dipilih."
  }

  if (!Array.isArray(imageItems) || imageItems.length === 0) {
    errors.images = "Minimal 1 image project wajib diupload."
  }

  if (liveUrl && !isValidHttpUrl(liveUrl)) {
    errors.link =
      "Live URL harus berupa link valid yang diawali http:// atau https://."
  }

  if (githubUrl && !isValidHttpUrl(githubUrl)) {
    errors.github =
      "GitHub URL harus berupa link valid yang diawali http:// atau https://."
  }

  return errors
}

export const SkeletonCard = () => (
  <div className="relative">
    <div
      className="absolute -inset-0.5 rounded-2xl blur opacity-10"
      style={{
        background:
          "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
      }}
    />
    <div className="relative bg-white/5 border border-white/12 rounded-2xl p-4 flex flex-col gap-3">
      <div className="w-full aspect-[16/8] bg-white/5 animate-pulse rounded-xl" />
      <div className="h-4 bg-white/5 animate-pulse rounded-lg w-2/3" />
      <div className="h-3 bg-white/5 animate-pulse rounded-lg w-full" />
      <div className="h-3 bg-white/5 animate-pulse rounded-lg w-4/5" />
      <div className="flex gap-1.5 mt-1">
        <div className="h-5 w-16 bg-white/5 animate-pulse rounded-full" />
        <div className="h-5 w-12 bg-white/5 animate-pulse rounded-full" />
        <div className="h-5 w-20 bg-white/5 animate-pulse rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-white/8 mt-auto">
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-white/5 animate-pulse rounded-lg" />
          <div className="w-7 h-7 bg-white/5 animate-pulse rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="w-14 h-7 bg-white/5 animate-pulse rounded-lg" />
          <div className="w-16 h-7 bg-white/5 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  </div>
)
