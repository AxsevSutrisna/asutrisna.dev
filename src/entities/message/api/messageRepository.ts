import { supabase } from "@/shared/api/supabaseClient"
import { wrapError } from "@/shared/api/errors"
import type { Message, MessageInput } from "@/entities/message/model/types"

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

/** Daftar pesan (dashboard admin). */
async function list(): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw wrapError(error, "Gagal memuat pesan")
  return (data ?? []) as Message[]
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

export const messageRepository = { send, list, remove, setRead }
