import { create } from "zustand"
import { socialLinkRepository } from "@/entities/socialLink/api/socialLinkRepository"
import type { SocialLink } from "@/entities/socialLink/model/types"

interface ContactState {
  socialLinks: SocialLink[]
  loading: boolean
  error: string | null
  fetchSocialLinks: (force?: boolean) => Promise<void>
}

// Dinamai useContactStore (dipertahankan dari store lama) karena publik
// mengaksesnya via useContactInfo + Home.
export const useContactStore = create<ContactState>((set, get) => ({
  socialLinks: [],
  loading: false,
  error: null,

  fetchSocialLinks: async (force = false) => {
    if (!force && get().socialLinks.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await socialLinkRepository.fetchActive()
      set({ socialLinks: data, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      })
    }
  },
}))
