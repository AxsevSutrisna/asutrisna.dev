import { supabase } from "../config/supabase"

export const projectService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  },
}
