import { supabase } from "../config/supabase"

export const courseService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  },
}
