import { supabase } from '../config/supabase';

export const contactService = {
  async fetchSocialLinks() {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }
};
