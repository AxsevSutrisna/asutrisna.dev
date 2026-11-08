/**
 * Error domain yang seragam untuk seluruh repository.
 * Repository `throw` AppError; use-case hook menangkap -> toast.
 */
export class AppError extends Error {
  readonly code?: string
  readonly originalError?: unknown

  constructor(message: string, options?: { code?: string; cause?: unknown }) {
    super(message)
    this.name = "AppError"
    this.code = options?.code
    this.originalError = options?.cause
  }
}

type SupabaseLikeError = { message?: string; code?: string } | null | undefined

/**
 * Bungkus error Supabase (atau apa pun) menjadi AppError dengan konteks.
 * Idempoten: AppError yang masuk dikembalikan apa adanya.
 */
export function wrapError(error: unknown, context?: string): AppError {
  if (error instanceof AppError) return error

  const supaError = error as SupabaseLikeError
  const baseMessage =
    supaError?.message ||
    (error instanceof Error ? error.message : "Terjadi kesalahan tak terduga")

  return new AppError(context ? `${context}: ${baseMessage}` : baseMessage, {
    code: supaError?.code,
    cause: error,
  })
}
