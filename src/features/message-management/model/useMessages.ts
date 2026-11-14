import { useCallback, useEffect, useState } from "react"
import {
  messageRepository,
  type MessageSort,
  type MessageStatus,
} from "@/entities/message/api/messageRepository"
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue"
import { errorMessage } from "@/shared/lib/errorMessage"
import type { Message } from "@/entities/message/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

const PAGE_SIZE = 10

/**
 * Use-case hook pengelolaan Messages (inbox) di dashboard admin dengan
 * pagination server-side. Pencarian/filter/sort juga dikirim ke DB agar benar
 * atas seluruh data; hitungan total & unread diambil global untuk badge.
 */
export function useMessageManagement(notify?: Notify) {
  const [items, setItems] = useState<Message[]>([])
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState({ total: 0, unread: 0 })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<MessageStatus>("all")
  const [sort, setSort] = useState<MessageSort>("newest")

  const debouncedSearch = useDebouncedValue(search, 300)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  // Kembali ke halaman 1 saat kriteria berubah.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status, sort])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [res, c] = await Promise.all([
        messageRepository.listPaged({
          page,
          pageSize: PAGE_SIZE,
          search: debouncedSearch,
          status,
          sort,
        }),
        messageRepository.counts(),
      ])
      setItems(res.rows)
      setTotal(res.total)
      setCounts(c)
    } catch (err) {
      notify?.("error", errorMessage(err, "Gagal memuat pesan"))
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, status, sort, notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Jika halaman melewati total (mis. setelah hapus item terakhir di halaman), mundur.
  useEffect(() => {
    if (!loading && page > totalPages) setPage(totalPages)
  }, [loading, page, totalPages])

  const run = useCallback(
    async (fn: () => Promise<unknown>, messages: { success?: string; error: string }) => {
      setBusy(true)
      try {
        await fn()
        if (messages.success) notify?.("success", messages.success)
        await refresh()
        return true
      } catch (err) {
        notify?.("error", errorMessage(err, messages.error))
        return false
      } finally {
        setBusy(false)
      }
    },
    [notify, refresh]
  )

  const removeMessage = (id: number | string) =>
    run(() => messageRepository.remove(id), {
      success: "Message deleted successfully!",
      error: "Failed to delete message",
    })

  const toggleRead = (item: Message) =>
    run(() => messageRepository.setRead(item.id, !item.is_read), {
      success: item.is_read ? "Marked as unread" : "Marked as read",
      error: "Failed to update status",
    })

  return {
    items,
    loading,
    busy,
    // pagination
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    total,
    // query controls
    search,
    setSearch,
    status,
    setStatus,
    sort,
    setSort,
    // global counts (badge & filter tabs)
    counts,
    // mutations
    removeMessage,
    toggleRead,
  }
}
