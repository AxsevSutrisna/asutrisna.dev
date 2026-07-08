import { supabase } from "../config/supabase"

export const experienceService = {
  async fetchWorkExperiences() {
    const { data, error } = await supabase.from("work_experiences").select("*")

    if (error) throw new Error(error.message)
    return data || []
  },

  async fetchEducations() {
    const { data, error } = await supabase.from("educations").select("*")

    if (error) throw new Error(error.message)
    return data || []
  },
}
