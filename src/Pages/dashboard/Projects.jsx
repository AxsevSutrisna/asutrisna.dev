import { useEffect, useState } from "react"
import { supabase } from "../../config/supabase"
import { MAX_PROJECT_IMAGES } from "../../utils/projectImages"
import { useToast } from "../../hooks/useToast"
import ToastStack from "../../components/ToastStack"
import {
  Plus,
  FolderGit2,
  LayoutGrid,
  List,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import AddNewButton from "./components/AddNewButton"
import Modal from "../../components/ui/Modal"
import ProjectCard from "./components/ProjectCard"
import ProjectRow from "./components/ProjectRow"
import ProjectForm from "./components/ProjectForm"
import {
  SkeletonCard,
  validateProjectForm,
} from "./components/projectHelpers.jsx"

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [hasOrderChanged, setHasOrderChanged] = useState(false)
  const { toasts, pushToast, removeToast } = useToast()

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const uploadImage = async (f) => {
    const fileName = `${Date.now()}-${f.name}`
    await supabase.storage.from("project-images").upload(fileName, f)
    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName)
    return data.publicUrl
  }

  const uploadProjectImages = async (imageItems) => {
    const uploadedUrls = []

    for (const item of (imageItems || []).slice(0, 6)) {
      if (item?.file) {
        uploadedUrls.push(await uploadImage(item.file))
      } else if (item?.url) {
        uploadedUrls.push(item.url)
      }
    }

    return [...new Set(uploadedUrls)].slice(0, MAX_PROJECT_IMAGES)
  }

  const handleCreate = async (form, imageItems) => {
    setUploading(true)
    const validationErrors = validateProjectForm(form, imageItems)
    const validationError = Object.values(validationErrors).find(Boolean)
    if (validationError) {
      pushToast("error", validationError)
      setUploading(false)
      return
    }

    const images = await uploadProjectImages(imageItems)
    await supabase.from("projects").insert({
      title: form.title,
      description: form.description,
      img: images[0] || "",
      images,
      tech_stack: form.techstack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      features: form.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      link: form.link,
      github: form.github,
      category: form.category,
    })
    setShowCreate(false)
    pushToast("success", "Project created successfully!")
    setUploading(false)
    fetchProjects()
  }

  const handleEdit = async (form, imageItems) => {
    setUploading(true)
    const validationErrors = validateProjectForm(form, imageItems)
    const validationError = Object.values(validationErrors).find(Boolean)
    if (validationError) {
      pushToast("error", validationError)
      setUploading(false)
      return
    }

    const images = await uploadProjectImages(imageItems)
    await supabase
      .from("projects")
      .update({
        title: form.title,
        description: form.description,
        img: images[0] || "",
        images,
        tech_stack: form.techstack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        features: form.features
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        link: form.link,
        github: form.github,
        category: form.category,
      })
      .eq("id", editProject.id)
    setEditProject(null)
    pushToast("success", "Project updated successfully!")
    setUploading(false)
    fetchProjects()
  }

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) {
      pushToast("error", error.message || "Failed to delete project")
      return
    }
    pushToast("success", "Project deleted successfully!")
    fetchProjects()
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const { source, destination } = result

    if (source.index === destination.index) return

    const newProjects = Array.from(projects)
    const [reorderedItem] = newProjects.splice(source.index, 1)
    newProjects.splice(destination.index, 0, reorderedItem)

    setProjects(newProjects)
    setHasOrderChanged(true)
  }

  const saveOrder = async () => {
    setUploading(true)
    try {
      const updates = projects.map((p, index) => ({
        ...p,
        order_index: index,
      }))

      const { error } = await supabase.from("projects").upsert(updates)

      if (error) throw error
      pushToast("success", "Project order saved successfully!")
      setHasOrderChanged(false)
    } catch (err) {
      pushToast("error", err.message || "Failed to save order")
    } finally {
      setUploading(false)
      fetchProjects()
    }
  }

  const [viewMode, setViewMode] = useState("grid")

  const publishedCount = projects.filter((p) => p.is_published ?? true).length
  const draftCount = projects.length - publishedCount

  return (
    <div className="space-y-6">
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
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Projects
            </h1>
            {!loading && (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">
                  <Eye className="w-3 h-3" /> {projects.length} total
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                  <CheckCircle2 className="w-3 h-3" /> {publishedCount}{" "}
                  published
                </span>
                {draftCount > 0 && (
                  <span className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
                    <Clock className="w-3 h-3" /> {draftCount} draft
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid view"
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="List view"
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {viewMode === "list" && hasOrderChanged && (
            <button
              onClick={saveOrder}
              disabled={uploading}
              className="cursor-target flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all font-medium text-sm"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-emerald-300/20 border-t-emerald-300 rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Save Order</span>
            </button>
          )}

          <AddNewButton
            onClick={() => setShowCreate(true)}
            label="New Project"
          />
        </div>
      </div>

      {showCreate && (
        <Modal title="Add New Project" onClose={() => setShowCreate(false)}>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel="Save Project"
            uploading={uploading}
          />
        </Modal>
      )}
      {editProject && (
        <Modal title="Edit Project" onClose={() => setEditProject(null)}>
          <ProjectForm
            initial={editProject}
            onSubmit={handleEdit}
            onCancel={() => setEditProject(null)}
            submitLabel="Update Project"
            uploading={uploading}
          />
        </Modal>
      )}

      {loading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/5 bg-white/[0.02]"
              >
                <div className="w-20 h-14 rounded-lg bg-white/5 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 animate-pulse rounded-lg w-1/3" />
                  <div className="h-3 bg-white/5 animate-pulse rounded-lg w-1/2" />
                </div>
                <div className="hidden sm:flex gap-1 w-40">
                  <div className="h-5 w-16 bg-white/5 animate-pulse rounded-full" />
                  <div className="h-5 w-14 bg-white/5 animate-pulse rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : projects.length === 0 ? (
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
              <FolderGit2 className="w-7 h-7 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-300 font-medium text-sm">
                No projects yet
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Add your first project to showcase your work
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="relative group mt-2"
            >
              <div
                className="absolute -inset-0.5 rounded-xl opacity-50 blur group-hover:opacity-90 transition duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary-light))",
                }}
              />
              <div
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-200"
                style={{ backgroundColor: "var(--color-backdrop-base)" }}
              >
                <Plus className="w-4 h-4 text-indigo-400" /> Create First
                Project
              </div>
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
              onEdit={setEditProject}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-2.5 bg-white/[0.03] border-b border-white/8">
            <div className="w-5 shrink-0" />
            <div className="w-20 shrink-0" />
            <div className="flex-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Project
            </div>
            <div className="hidden sm:block w-40 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Tech Stack
            </div>
            <div className="hidden lg:block w-36 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Features
            </div>
            <div className="w-36 shrink-0" />
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-2 space-y-1"
                >
                  {projects.map((project, i) => (
                    <Draggable
                      key={project.id.toString()}
                      draggableId={project.id.toString()}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <ProjectRow
                          project={project}
                          onDelete={deleteProject}
                          onEdit={setEditProject}
                          index={i}
                          provided={provided}
                          isDragging={snapshot.isDragging}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}
