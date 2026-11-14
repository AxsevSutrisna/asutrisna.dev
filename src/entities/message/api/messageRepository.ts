import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import type { Message, MessageInput } from "@/entities/message/model/types"

export type MessageStatus = "all" | "unread" | "read"
export type MessageSort = "newest" | "oldest"

export interface MessageQuery {
  page?: number
  pageSize?: number
  search?: string
  status?: MessageStatus
  sort?: MessageSort
}

export interface MessagePage {
  rows: Message[]
  total: number
}

export interface MessageCounts {
  total: number
  unread: number
}

/** Kirim pesan dari form kontak publik (insert-only). */
async function send(input: MessageInput): Promise<void> {
  const { error } = await supabase.from("messages").insert([
    {
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
    },
  ])
  if (error) throw wrapError(error, "Gagal mengirim pesan")
}

/** Bersihkan karakter yang bisa merusak sintaks filter `or` PostgREST. */
function sanitizeSearch(value: string): string {
  return value.replace(/[,()*]/g, " ").trim()
}

/**
 * Daftar pesan terpaginasi (dashboard admin). Pencarian, filter status, dan
 * pengurutan dilakukan di DB agar tetap benar atas SELURUH data, bukan hanya
 * halaman yang ter-load. Mengembalikan baris halaman + total (untuk pagination).
 */
async function listPaged(query: MessageQuery = {}): Promise<MessagePage> {
  const page = Math.max(1, query.page ?? 1)
  const pageSize = Math.max(1, query.pageSize ?? 10)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let q = supabase.from("messages").select("*", { count: "exact" })

  if (query.status === "unread") q = q.eq("is_read", false)
  else if (query.status === "read") q = q.eq("is_read", true)

  const search = sanitizeSearch(query.search ?? "")
  if (search) {
    const like = `%${search}%`
    q = q.or(
      `name.ilike.${like},email.ilike.${like},subject.ilike.${like},message.ilike.${like}`
    )
  }

  q = q
    .order("created_at", { ascending: query.sort === "oldest" })
    .range(from, to)

  const { data, error, count } = await q
  if (error) throw wrapError(error, "Gagal memuat pesan")
  return { rows: (data ?? []) as Message[], total: count ?? 0 }
}

/** Hitungan global (total + belum dibaca) untuk badge & filter tab. */
async function counts(): Promise<MessageCounts> {
  const totalQuery = supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
  const unreadQuery = supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)

  const [totalRes, unreadRes] = await Promise.all([totalQuery, unreadQuery])
  if (totalRes.error) throw wrapError(totalRes.error, "Gagal memuat pesan")
  if (unreadRes.error) throw wrapError(unreadRes.error, "Gagal memuat pesan")

  return { total: totalRes.count ?? 0, unread: unreadRes.count ?? 0 }
}

async function remove(id: number | string): Promise<void> {
  const { error } = await supabase.from("messages").delete().eq("id", id)
  if (error) throw wrapError(error, "Gagal menghapus pesan")
}

async function setRead(id: number | string, isRead: boolean): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: isRead })
    .eq("id", id)
  if (error) throw wrapError(error, "Gagal memperbarui status pesan")
}

export const messageRepository = { send, listPaged, counts, remove, setRead }
