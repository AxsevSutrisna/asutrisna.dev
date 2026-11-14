import { useCallback, useEffect, useRef, useState } from "react"
import { errorMessage } from "@/shared/lib/errorMessage"

type Notify = (type: "success" | "error" | "info", message: string) => void

interface Options<T> {
  /** Transformasi baris mentah (mis. normalize + sort) sebelum disimpan. */
  map?: (rows: T[]) => T[]
  /** Pesan error saat gagal memuat. */
  loadError?: string
}

/**
 * Basis hook pengelolaan resource dashboard — menghapus boilerplate yang dulu
 * diduplikasi di ~11 management hook: state items/loading/busy, fetch + refresh,
 * dan pembungkus mutasi (`run`) yang menangani busy + notify + refresh.
 *
 * `fetcher` HARUS stabil (lempar method repository langsung, mis. repo.fetchAll).
 */
export function useCrudResource<T>(
  fetcher: () => Promise<T[]>,
  notify?: Notify,
  options?: Options<T>
) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  // Simpan opsi di ref agar identitas `refresh` tetap stabil (hindari refetch loop).
  const optsRef = useRef(options)
  optsRef.current = options

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const rows = await fetcher()
      const map = optsRef.current?.map
      setItems(map ? map(rows) : rows)
    } catch (err) {
      notify?.(
        "error",
        errorMessage(err, optsRef.current?.loadError ?? "Failed to load data")
      )
    } finally {
      setLoading(false)
    }
  }, [fetcher, notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  /**
   * Jalankan satu mutasi: set busy, panggil fn, toast sukses (opsional),
   * refresh daftar, lalu kembalikan true/false. Error → toast `error`.
   */
  const run = useCallback(
    async (
      fn: () => Promise<unknown>,
      messages: { success?: string; error: string }
    ): Promise<boolean> => {
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

  return { items, setItems, loading, busy, refresh, run }
}
