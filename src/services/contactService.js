import { supabase } from "../config/supabase"

export const contactService = {
  async fetchSocialLinks() {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  },

  async sendMessage(messageData) {
    const { data, error } = await supabase.from("messages").insert([
      {
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message,
      },
    ])

    if (error) throw new Error(error.message)
    return data
  },
}
