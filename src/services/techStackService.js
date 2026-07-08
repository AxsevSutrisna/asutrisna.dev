import { supabase } from "../config/supabase"

export const techStackService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("tech_stacks")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  },
}
