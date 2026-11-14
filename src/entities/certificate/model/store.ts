import { create } from "zustand"
import { certificateRepository } from "@/entities/certificate/api/certificateRepository"
import type { Certificate } from "@/entities/certificate/model/types"

interface CertificateState {
  certificates: Certificate[]
  loading: boolean
  error: string | null
  fetchCertificates: (force?: boolean) => Promise<void>
}

export const useCertificatesStore = create<CertificateState>((set, get) => ({
  certificates: [],
  loading: false,
  error: null,

  fetchCertificates: async (force = false) => {
    if (!force && get().certificates.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await certificateRepository.fetchAll()
      set({ certificates: data, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      })
    }
  },
}))
