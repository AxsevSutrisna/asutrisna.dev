import { useEffect, useState } from "react"

/**
 * Mengembalikan nilai yang di-debounce — berguna untuk input pencarian yang
 * memicu query server, agar tak menembak DB tiap ketukan tombol.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
