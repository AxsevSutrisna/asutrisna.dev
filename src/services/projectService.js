import { supabase } from '../config/supabase';

export const projectService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order('id', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
};
