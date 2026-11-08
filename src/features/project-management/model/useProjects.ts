import { useCallback, useEffect, useState } from "react"
import { projectRepository } from "@/entities/project/api/projectRepository"
import type { ProjectImageItem } from "@/entities/project/api/projectRepository"
import type { ProjectFormValues } from "@/entities/project/lib/projectMapper"
import type { Project } from "@/entities/project/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/**
 * Use-case hook untuk pengelolaan Projects di dashboard admin.
 * Mengorkestrasi repository (upload + CRUD + reorder), state loading/uploading,
 * refresh pasca-mutasi, dan notifikasi toast. Tidak menyentuh supabase langsung.
 */
export function useProjectManagement(notify?: Notify) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setProjects(await projectRepository.fetchAll())
    } catch (err) {
      notify?.("error", message(err, "Gagal memuat projects"))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createProject = useCallback(
    async (form: ProjectFormValues, images: ProjectImageItem[]) => {
      setUploading(true)
      try {
        const urls = await projectRepository.uploadImages(images)
        await projectRepository.create(form, urls)
        notify?.("success", "Project created successfully!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal membuat project"))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh]
  )

  const updateProject = useCallback(
    async (
      id: number | string,
      form: ProjectFormValues,
      images: ProjectImageItem[]
    ) => {
      setUploading(true)
      try {
        const urls = await projectRepository.uploadImages(images)
        await projectRepository.update(id, form, urls)
        notify?.("success", "Project updated successfully!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Gagal memperbarui project"))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh]
  )

  const removeProject = useCallback(
    async (id: number | string) => {
      try {
        await projectRepository.remove(id)
        notify?.("success", "Project deleted successfully!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal menghapus project"))
      }
    },
    [notify, refresh]
  )

  const reorderProjects = useCallback(
    async (ordered: Project[]) => {
      setUploading(true)
      try {
        await projectRepository.reorder(ordered.map((project) => project.id))
        notify?.("success", "Project order saved successfully!")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Gagal menyimpan urutan project"))
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh]
  )

  return {
    projects,
    setProjects,
    loading,
    uploading,
    refresh,
    createProject,
    updateProject,
    removeProject,
    reorderProjects,
  }
}
