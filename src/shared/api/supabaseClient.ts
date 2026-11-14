import { createClient } from "@supabase/supabase-js"
import { env } from "@/shared/config/env"

/**
 * Satu-satunya instance Supabase client untuk app graph.
 *
 * ATURAN ARSITEKTUR: hanya layer repository (`entities/<e>/api`) dan helper di
 * `shared/api` yang boleh mengimpor client ini. Komponen UI TIDAK boleh
 * menyentuh `supabase` langsung — gunakan repository / use-case hook.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey)
