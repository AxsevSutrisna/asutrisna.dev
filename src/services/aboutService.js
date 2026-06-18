import { supabase } from '../config/supabase';

export const aboutService = {
  async fetchAboutContent() {
    const { data, error } = await supabase
      .from("about_contents")
      .select("*")
      .eq("is_published", true)
      .order("version", { ascending: false })
      .limit(1);

    if (error) throw new Error(error.message);
    return data?.[0] || null;
  }
};
