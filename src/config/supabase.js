import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL:", supabaseUrl)
  console.error("Supabase Anon Key:", supabaseKey)
  throw new Error(
    "Koneksi Supabase gagal: URL atau Anon Key tidak ditemukan. " +
      "Pastikan file .env Anda berisi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, " +
      "serta lakukan restart pada dev server Vite Anda."
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
