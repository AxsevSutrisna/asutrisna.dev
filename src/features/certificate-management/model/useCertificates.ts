import { useCallback, useEffect, useState } from "react"
import { certificateRepository } from "@/entities/certificate/api/certificateRepository"
import type { Certificate } from "@/entities/certificate/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

const message = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback

/** Use-case hook pengelolaan Certificates di dashboard admin. */
export function useCertificateManagement(notify?: Notify) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setCertificates(await certificateRepository.fetchAll())
    } catch (err) {
      notify?.("error", message(err, "Failed to load certificates"))
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const uploadCertificate = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        await certificateRepository.create(file)
        notify?.("success", "Certificate uploaded successfully!")
        await refresh()
        return true
      } catch (err) {
        notify?.("error", message(err, "Failed to upload certificate"))
        return false
      } finally {
        setUploading(false)
      }
    },
    [notify, refresh]
  )

  const removeCertificate = useCallback(
    async (id: number | string) => {
      try {
        await certificateRepository.remove(id)
        notify?.("success", "Certificate deleted")
        await refresh()
      } catch (err) {
        notify?.("error", message(err, "Failed to delete certificate"))
      }
    },
    [notify, refresh]
  )

  return {
    certificates,
    loading,
    uploading,
    uploadCertificate,
    removeCertificate,
  }
}
