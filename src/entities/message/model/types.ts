/** Entity Message (pesan kontak masuk). */
export interface Message {
  id: number | string
  name: string | null
  email: string | null
  subject: string | null
  message: string | null
  is_read: boolean
  created_at?: string | null
}

/** Payload kirim pesan dari form kontak publik. */
export interface MessageInput {
  name: string
  email: string
  subject: string
  message: string
}
