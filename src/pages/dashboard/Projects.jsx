import { useState } from "react"
import { useToast } from "@/hooks/useToast"
import { useConfirm } from "@/components/ui/useConfirm"
import ToastStack from "@/components/ToastStack"
import { useProjectManagement } from "@/features/project-management/model/useProjects"
import {
  Plus,
  FolderGit2,
  LayoutGrid,
  List,
  Eye,
  CheckCircle2,
  Clock,
  Search,
  X,
  SlidersHorizontal,
  GripVertical,
} from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import AddNewButton from "./components/AddNewButton"
import Modal from "@/components/ui/Modal"
import ProjectCard from "./components/ProjectCard"
import ProjectRow from "./components/ProjectRow"
import ProjectForm from "./components/ProjectForm"
import { SkeletonCard } from "./components/projectHelpers.jsx"

export default function Projects() {
  const { toasts, pushToast, removeToast } = useToast()
  const confirm = useConfirm()
  const {
    projects,
    setProjects,
    loading,
    uploading,
    createProject,
    updateProject,
    removeProject,
    reorderProjects,
  } = useProjectManagement(pushToast)

  const [showCreate, setShowCreate] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [hasOrderChanged, setHasOrderChanged] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // all | published | draft
  const [categoryFilter, setCategoryFilter] = useState("all")

  // ProjectForm sudah memvalidasi sebelum onSubmit; di sini cukup orkestrasi.
  const handleCreate = async (form, imageItems) => {
    const ok = await createProject(form, imageItems)
    if (ok) setShowCreate(false)
  }

  const handleEdit = async (form, imageItems) => {
    const ok = await updateProject(editProject.id, form, imageItems)
    if (ok) setEditProject(null)
  }

  const deleteProject = async (id) => {
    const ok = await confirm({
      title: "Delete this project?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      tone: "danger",
    })
    if (!ok) return
    removeProject(id)
  }

  const handleDragEnd = (result) => {
    // Reorder hanya valid pada daftar penuh (tanpa filter aktif).
    if (isFiltering) return
    if (!result.destination) return
    const { source, destination } = result
    if (source.index === destination.index) return

    const next = Array.from(projects)
    const [moved] = next.splice(source.index, 1)
    next.splice(destination.index, 0, moved)

    setProjects(next)
    setHasOrderChanged(true)
  }

  const saveOrder = async () => {
    await reorderProjects(projects)
    setHasOrderChanged(false)
  }

  const publishedCount = projects.filter((p) => p.isPublished ?? true).length
  const draftCount = projects.length - publishedCount

  // --- Pencarian & filter ---
  const categories = [
    ...new Set(projects.map((p) => p.category).filter(Boolean)),
  ].sort()
  const q = search.trim().toLowerCase()
  const isFiltering =
    q !== "" || statusFilter !== "all" || categoryFilter !== "all"

  const visibleProjects = isFiltering
    ? projects.filter((p) => {
        const published = p.isPublished ?? true
        const matchStatus =
          statusFilter === "all" ||
          (statusFilter === "published" ? published : !published)
        const matchCategory =
          categoryFilter === "all" || p.category === categoryFilter
        const haystack = [
          p.title,
          p.description,
          p.category,
          ...(p.techStack || []),
          ...(p.features || []),
        ]
          .join(" ")
          .toLowerCase()
        const matchSearch = q === "" || haystack.includes(q)
        return matchStatus && matchCategory && matchSearch
      })
    : projects

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setCategoryFilter("all")
  }

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
              className={`cursor-target p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-gray-500 border border-transparent hover:bg-white/5 hover:text-gray-200 hover:border-white/10"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="List view"
              className={`cursor-target p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-gray-500 border border-transparent hover:bg-white/5 hover:text-gray-200 hover:border-white/10"
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

      {/* Toolbar: pencarian + filter */}
      {!loading && projects.length > 0 && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, tech stack, kategori…"
              aria-label="Cari project"
              className="cursor-target w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-sm text-gray-200 placeholder-gray-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter kategori"
                className="cursor-target appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-300 outline-none transition-all hover:border-white/20 hover:bg-white/10 focus:border-indigo-500/50"
              >
                <option value="all">Semua kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-0.5 rounded-xl border border-white/10 bg-white/5 p-1">
              {[
                { key: "all", label: "Semua" },
                { key: "published", label: "Published" },
                { key: "draft", label: "Draft" },
              ].map(({ key, label }) => {
                const active = statusFilter === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(key)}
                    aria-pressed={active}
                    className={`cursor-target rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? "border border-indigo-500/30 bg-indigo-500/20 text-indigo-200"
                        : "border border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {!loading && projects.length > 0 && isFiltering && (
        <div className="-mt-2 flex items-center gap-2 text-xs text-gray-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>
            Menampilkan{" "}
            <span className="font-medium text-gray-300">
              {visibleProjects.length}
            </span>{" "}
            dari {projects.length} project
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="ml-1 text-indigo-300 underline-offset-2 transition-colors hover:text-indigo-200 hover:underline"
          >
            Reset filter
          </button>
        </div>
      )}

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
      ) : visibleProjects.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/8 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Search className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">
              Tidak ada project yang cocok
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Coba ubah kata kunci atau filter yang dipilih.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-target rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white"
          >
            Reset filter
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleProjects.map((project) => (
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
          {isFiltering && (
            <div className="flex items-center gap-2 border-b border-amber-500/15 bg-amber-500/5 px-4 py-2 text-[11px] text-amber-300/80">
              <GripVertical className="h-3.5 w-3.5 shrink-0" />
              Pengurutan dinonaktifkan saat filter aktif — reset filter untuk mengatur urutan.
            </div>
          )}
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
                  {visibleProjects.map((project, i) => (
                    <Draggable
                      key={project.id.toString()}
                      draggableId={project.id.toString()}
                      index={i}
                      isDragDisabled={isFiltering}
                    >
                      {(provided, snapshot) => (
                        <ProjectRow
                          project={project}
                          onDelete={deleteProject}
                          onEdit={setEditProject}
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
