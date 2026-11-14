import { useState } from "react"

/**
 * Drag-and-drop HTML5 untuk reorder grid kartu — sebelumnya diduplikasi di
 * TechStacks / SocialLinks / Achievements.
 *
 * Pakai:
 *   const dnd = useReorderDnD(items, (next) => reorderItems(next))
 *   <div {...dnd.getItemProps(item.id)} className={dnd.isDragging(item.id) ? ... : ...}>
 */
export function useReorderDnD(items, onReorder) {
  const [draggingId, setDraggingId] = useState(null)
  const [dropTargetId, setDropTargetId] = useState(null)

  const reset = () => {
    setDraggingId(null)
    setDropTargetId(null)
  }

  const getItemProps = (id) => ({
    draggable: true,
    onDragStart: () => setDraggingId(id),
    onDragOver: (e) => e.preventDefault(),
    onDragEnter: () => {
      if (draggingId && draggingId !== id) setDropTargetId(id)
    },
    onDragLeave: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget) && dropTargetId === id) {
        setDropTargetId(null)
      }
    },
    onDragEnd: reset,
    onDrop: async () => {
      const source = items.findIndex((it) => it.id === draggingId)
      const target = items.findIndex((it) => it.id === id)
      reset()
      if (source === -1 || target === -1 || source === target) return
      const next = [...items]
      const [moved] = next.splice(source, 1)
      next.splice(target, 0, moved)
      await onReorder(next)
    },
  })

  return {
    draggingId,
    dropTargetId,
    getItemProps,
    isDragging: (id) => draggingId === id,
    isDropTarget: (id) => dropTargetId === id,
  }
}
