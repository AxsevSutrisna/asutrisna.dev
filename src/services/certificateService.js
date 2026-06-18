import { supabase } from '../config/supabase';

export const certificateService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order('id', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
};
