import { supabase } from '../config/supabase';

export const achievementService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
};
