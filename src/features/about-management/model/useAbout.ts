import { aboutRepository } from "@/entities/about/api/aboutRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import type { AboutContent } from "@/entities/about/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

interface AboutFormValues {
  name: string
  description: string
  quote: string
  role_badges: unknown
  is_published: boolean
}

/** Use-case hook pengelolaan About content di dashboard admin. */
export function useAboutManagement(notify?: Notify) {
  const { items, loading, busy, run } = useCrudResource<AboutContent>(
    aboutRepository.list,
    notify,
    { loadError: "Failed to load about content" }
  )

  const createAbout = (
    form: AboutFormValues,
    photoFile: File | null,
    cvFileEn: File | null,
    cvFileId: File | null
  ) =>
    run(
      async () => {
        const photoUrl = photoFile
          ? await aboutRepository.uploadPhoto(photoFile)
          : ""
        const cvEnUrl = cvFileEn ? await aboutRepository.uploadCv(cvFileEn) : ""
        const cvIdUrl = cvFileId ? await aboutRepository.uploadCv(cvFileId) : ""
        await aboutRepository.create({
          name: form.name,
          description: form.description,
          quote: form.quote,
          role_badges: form.role_badges,
          photo_url: photoUrl,
          cv_en_url: cvEnUrl,
          cv_id_url: cvIdUrl,
          is_published: form.is_published,
          version: 1,
        })
      },
      {
        success: "About content created successfully!",
        error: "Failed to save about content",
      }
    )

  const updateAbout = (
    item: AboutContent,
    form: AboutFormValues,
    photoFile: File | null,
    cvFileEn: File | null,
    cvFileId: File | null
  ) =>
    run(
      async () => {
        const photoUrl = photoFile
          ? await aboutRepository.uploadPhoto(photoFile)
          : item.photo_url || ""
        const cvEnUrl = cvFileEn
          ? await aboutRepository.uploadCv(cvFileEn)
          : item.cv_en_url || ""
        const cvIdUrl = cvFileId
          ? await aboutRepository.uploadCv(cvFileId)
          : item.cv_id_url || ""
        await aboutRepository.update(item.id, {
          name: form.name,
          description: form.description,
          quote: form.quote,
          role_badges: form.role_badges,
          photo_url: photoUrl,
          cv_en_url: cvEnUrl,
          cv_id_url: cvIdUrl,
          is_published: form.is_published,
          version: (Number(item.version) || 1) + 1,
        })
      },
      {
        success: "About content updated successfully!",
        error: "Failed to update about content",
      }
    )

  const removeAbout = (id: number | string) =>
    run(() => aboutRepository.remove(id), {
      success: "About content deleted!",
      error: "Failed to delete",
    })

  const togglePublish = (item: AboutContent) =>
    run(
      () =>
        item.is_published
          ? aboutRepository.unpublish(item.id)
          : aboutRepository.publish(item.id),
      {
        success: item.is_published ? "Unpublished!" : "Published!",
        error: "Failed to update publish status",
      }
    )

  const viewCv = async (cvUrl: string) => {
    const signed = await aboutRepository.getCvSignedUrl(cvUrl)
    window.open(signed || cvUrl, "_blank")
  }

  return {
    items,
    loading,
    uploading: busy,
    createAbout,
    updateAbout,
    removeAbout,
    togglePublish,
    viewCv,
  }
}
