import { create } from 'zustand';
import { certificateService } from '../services/certificateService';

export const useCertificatesStore = create((set, get) => ({
  certificates: [],
  loading: false,
  error: null,

  fetchCertificates: async (force = false) => {
    if (!force && get().certificates.length > 0) return;

    set({ loading: true, error: null });
    try {
      const data = await certificateService.fetchAll();
      set({ certificates: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));

