import { create } from 'zustand';
import { contactService } from '../services/contactService';

export const useContactStore = create((set, get) => ({
  socialLinks: [],
  loading: false,
  error: null,

  fetchSocialLinks: async () => {
    if (get().socialLinks.length > 0) return;

    set({ loading: true, error: null });
    try {
      const data = await contactService.fetchSocialLinks();
      set({ socialLinks: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));
