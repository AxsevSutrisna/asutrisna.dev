import { useCallback, useEffect, useState } from "react"
import { messageRepository } from "@/entities/message/api/messageRepository"
import type { Message } from "@/entities/message/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

const toMessage = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/** Use-case hook pengelolaan Messages (inbox) di dashboard admin. */
export function useMessageManagement(notify?: Notify) {
  const [items, setItems] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await messageRepository.list())
    } catch (err) {
      notify?.("error", toMessage(err, "Gagal memuat pesan"))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const removeMessage = useCallback(
    async (id: number | string) => {
      try {
        await messageRepository.remove(id)
        notify?.("success", "Message deleted successfully!")
        await refresh()
      } catch (err) {
        notify?.("error", toMessage(err, "Failed to delete message"))
      }
    },
    [notify, refresh]
  )

  const toggleRead = useCallback(
    async (item: Message) => {
      try {
        await messageRepository.setRead(item.id, !item.is_read)
        notify?.("success", item.is_read ? "Marked as unread" : "Marked as read")
        await refresh()
      } catch (err) {
        notify?.("error", toMessage(err, "Failed to update status"))
      }
    },
    [notify, refresh]
  )

  return { items, loading, removeMessage, toggleRead }
}
