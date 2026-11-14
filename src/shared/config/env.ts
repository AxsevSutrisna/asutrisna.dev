/**
 * Pembaca environment aplikasi (runtime browser / Vite).
 *
 * CATATAN: ini HANYA untuk app graph (Vite, `import.meta.env`).
 * Script Node seperti `scripts/generate-sitemap.mjs` punya pembaca `process.env`
 * sendiri dan TIDAK boleh mengimpor modul ini.
 */

export interface AppEnv {
  supabaseUrl: string
  supabaseAnonKey: string
  /** Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Opsional. */
  gaMeasurementId?: string
}

function readEnv(): AppEnv {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Pesan dipertahankan dari implementasi lama (src/config/supabase.js)
    console.error("Supabase URL:", supabaseUrl)
    console.error("Supabase Anon Key:", supabaseAnonKey)
    throw new Error(
      "Koneksi Supabase gagal: URL atau Anon Key tidak ditemukan. " +
        "Pastikan file .env Anda berisi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, " +
        "serta lakukan restart pada dev server Vite Anda."
    )
  }

  // Opsional — analytics dinonaktifkan otomatis bila kosong.
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || undefined

  return { supabaseUrl, supabaseAnonKey, gaMeasurementId }
}

export const env: AppEnv = readEnv()
