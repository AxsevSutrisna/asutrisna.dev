/**
 * @deprecated Re-export shim. Client Supabase sekarang hidup di
 * `src/shared/api/supabaseClient.ts`.
 *
 * File ini dipertahankan agar 27 import lama (`../config/supabase`) tetap jalan
 * selama migrasi bertahap. Impor baru sebaiknya pakai `@/shared/api`.
 */
export { supabase } from "../shared/api/supabaseClient"
