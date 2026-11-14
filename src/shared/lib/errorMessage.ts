/** Pesan error aman: `err.message` bila Error, selain itu fallback. */
export const errorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback
