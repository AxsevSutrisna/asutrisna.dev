import { certificateRepository } from "@/entities/certificate/api/certificateRepository"
import { useCrudResource } from "@/shared/lib/useCrudResource"
import type { Certificate } from "@/entities/certificate/model/types"

type Notify = (type: "success" | "error" | "info", message: string) => void

/** Use-case hook pengelolaan Certificates di dashboard admin. */
export function useCertificateManagement(notify?: Notify) {
  const { items, loading, busy, run } = useCrudResource<Certificate>(
    certificateRepository.fetchAll,
    notify,
    { loadError: "Failed to load certificates" }
  )

  const uploadCertificate = (file: File) =>
    run(() => certificateRepository.create(file), {
      success: "Certificate uploaded successfully!",
      error: "Failed to upload certificate",
    })

  const removeCertificate = (id: number | string) =>
    run(() => certificateRepository.remove(id), {
      success: "Certificate deleted",
      error: "Failed to delete certificate",
    })

  return {
    certificates: items,
    loading,
    uploading: busy,
    uploadCertificate,
    removeCertificate,
  }
}
