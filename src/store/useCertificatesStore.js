import { create } from 'zustand';
import { certificateService } from '../services/certificateService';

export const useCertificatesStore = create((set, get) => {
  let initialCertificates = [];
  try {
    const cached = localStorage.getItem('certificates');
    if (cached) initialCertificates = JSON.parse(cached);
  } catch (e) {
    console.error(e);
  }

  return {
    certificates: initialCertificates,
    loading: false,
    error: null,

    fetchCertificates: async (force = false) => {
      if (!force && get().certificates.length > 0) return;

      set({ loading: true, error: null });
      try {
        const data = await certificateService.fetchAll();
        set({ certificates: data, loading: false });
        localStorage.setItem('certificates', JSON.stringify(data));
      } catch (err) {
        set({ error: err.message, loading: false });
      }
    }
  };
});
