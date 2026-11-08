import { useCallback, useEffect, useState } from "react"
import { aboutRepository } from "@/entities/about/api/aboutRepository"
import type { AboutContent } from "@/entities/about/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

interface AboutFormValues {
  name: string
  description: string
  quote: string
  role_badges: unknown
  is_published: boolean
}

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/** Use-case hook pengelolaan About content di dashboard admin. */
export function useAboutManagement(notify?: Notify) {
  const [items, setItems] = useState<AboutContent[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await aboutRepository.list())
    } catch (err) {
      notify?.("error", message(err, "Failed to load about content"))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createAbout = useCallback(
    async (
      form: AboutFormValues,
      photoFile: File | null,
      cvFileEn: File | null,
      cvFileId: File | null
    ) => {
      setUploading(true)
      try {
        const photoUrl = photoFile ? await aboutRepository.uploadPhoto(photoFile) : ""
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
        notify?.("success", "About content created successfully!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Failed to save about content"))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh]
  )

  const updateAbout = useCallback(
    async (
      item: AboutContent,
      form: AboutFormValues,
      photoFile: File | null,
      cvFileEn: File | null,
      cvFileId: File | null
    ) => {
      setUploading(true)
      try {
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
        notify?.("success", "About content updated successfully!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Failed to update about content"))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh]
  )

  const removeAbout = useCallback(
    async (id: number | string) => {
      try {
        await aboutRepository.remove(id)
        notify?.("success", "About content deleted!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Failed to delete"))
      }
    },
    [notify, refresh]
  )

  const togglePublish = useCallback(
    async (item: AboutContent) => {
      try {
        if (item.is_published) {
          await aboutRepository.unpublish(item.id)
          notify?.("success", "Unpublished!")
        } else {
          await aboutRepository.publish(item.id)
          notify?.("success", "Published!")
        }
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Failed to update publish status"))
      }
    },
    [notify, refresh]
  )

  const viewCv = useCallback(async (cvUrl: string) => {
    const signed = await aboutRepository.getCvSignedUrl(cvUrl)
    window.open(signed || cvUrl, "_blank")
  }, [])

  return {
    items,
    loading,
    uploading,
    createAbout,
    updateAbout,
    removeAbout,
    togglePublish,
    viewCv,
  }
}
