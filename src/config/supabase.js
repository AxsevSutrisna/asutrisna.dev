import { createClient } from '@supabase/supabase-js';

// 1. Ambil kunci URL dan Anon Key dari variabel lingkungan (.env)
// Di Vite, variabel lingkungan harus diawali dengan VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Lakukan validasi ketat sebelum menginisialisasi client
// Ini mencegah error runtime yang membingungkan akibat kredensial kosong
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL:", supabaseUrl);
  console.error("Supabase Anon Key:", supabaseKey);
  throw new Error(
    "Koneksi Supabase gagal: URL atau Anon Key tidak ditemukan. " +
    "Pastikan file .env Anda berisi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, " +
    "serta lakukan restart pada dev server Vite Anda."
  );
}

// 3. Inisialisasi client instance tunggal untuk seluruh aplikasi
export const supabase = createClient(supabaseUrl, supabaseKey);
