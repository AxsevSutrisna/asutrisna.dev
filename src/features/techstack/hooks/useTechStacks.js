import { useEffect, useMemo } from "react"
import { useTechStackStore } from "../../../store/useTechStackStore"

export function useTechStacks() {
  const {
    techStacks: rawStacks,
    loading,
    fetchTechStacks,
  } = useTechStackStore()

  useEffect(() => {
    fetchTechStacks()
  }, [fetchTechStacks])

  const techStacks = useMemo(() => {
    if (!Array.isArray(rawStacks)) return {}
    return rawStacks.reduce((acc, stack) => {
      const category = stack.category || "General"
      if (!acc[category]) acc[category] = []
      acc[category].push(stack)
      return acc
    }, {})
  }, [rawStacks])

  return { techStacks, loading }
}
