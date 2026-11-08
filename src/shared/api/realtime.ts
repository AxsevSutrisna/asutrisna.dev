import { supabase } from "@/shared/api/supabaseClient"
import type {
  RealtimePostgresChangesPayload,
  RealtimeChannel,
} from "@supabase/supabase-js"

export interface SubscribeOptions {
  /** Nama channel unik. */
  channel: string
  table: string
  schema?: string
  /** Default "*" (INSERT | UPDATE | DELETE). */
  event?: "*" | "INSERT" | "UPDATE" | "DELETE"
  /** Filter postgres, mis. "id=eq.1". */
  filter?: string
}

type ChangeCallback = (
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>
) => void

/**
 * Berlangganan perubahan tabel Supabase secara konsisten.
 *
 * Mengatasi dua masalah yang ada di kode lama:
 *  - cleanup tidak konsisten (removeChannel vs unsubscribe) -> selalu removeChannel.
 *  - StrictMode double-effect + `.subscribe()` async -> unsubscribe idempoten
 *    + mounted-flag guard supaya callback tak jalan setelah teardown.
 *
 * @returns fungsi unsubscribe yang aman dipanggil berkali-kali.
 */
export function subscribe(
  options: SubscribeOptions,
  callback: ChangeCallback
): () => void {
  let active = true

  const channel: RealtimeChannel = supabase.channel(options.channel)

  channel.on(
    // @ts-expect-error — overload "postgres_changes" supabase-js tak cocok dengan union event; bentuk filter benar saat runtime.
    "postgres_changes",
    {
      event: options.event ?? "*",
      schema: options.schema ?? "public",
      table: options.table,
      ...(options.filter ? { filter: options.filter } : {}),
    },
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      if (active) callback(payload)
    }
  )

  channel.subscribe()

  return () => {
    if (!active) return
    active = false
    supabase.removeChannel(channel)
  }
}
