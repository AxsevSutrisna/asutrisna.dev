import { projectRepository } from "@/entities/project/api/projectRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import type { ProjectImageItem } from "@/entities/project/api/projectRepository"
import type { ProjectFormValues } from "@/entities/project/lib/projectMapper"
import type { Project } from "@/entities/project/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

/**
 * Use-case hook pengelolaan Projects di dashboard admin.
 * Mengorkestrasi repository (upload + CRUD + reorder) via useCrudResource.
 */
export function useProjectManagement(notify?: Notify) {
  const { items, setItems, loading, busy, refresh, run } =
    useCrudResource<Project>(projectRepository.fetchAll, notify, {
      loadError: "Gagal memuat projects",
    })

  const createProject = (form: ProjectFormValues, images: ProjectImageItem[]) =>
    run(
      async () => {
        const urls = await projectRepository.uploadImages(images)
        await projectRepository.create(form, urls)
      },
      {
        success: "Project created successfully!",
        error: "Gagal membuat project",
      }
    )

  const updateProject = (
    id: number | string,
    form: ProjectFormValues,
    images: ProjectImageItem[]
  ) =>
    run(
      async () => {
        const urls = await projectRepository.uploadImages(images)
        await projectRepository.update(id, form, urls)
      },
      {
        success: "Project updated successfully!",
        error: "Gagal memperbarui project",
      }
    )

  const removeProject = (id: number | string) =>
    run(() => projectRepository.remove(id), {
      success: "Project deleted successfully!",
      error: "Gagal menghapus project",
    })

  const reorderProjects = (ordered: Project[]) =>
    run(() => projectRepository.reorder(ordered.map((project) => project.id)), {
      success: "Project order saved successfully!",
      error: "Gagal menyimpan urutan project",
    })

  return {
    projects: items,
    setProjects: setItems,
    loading,
    uploading: busy,
    refresh,
    createProject,
    updateProject,
    removeProject,
    reorderProjects,
  }
}
