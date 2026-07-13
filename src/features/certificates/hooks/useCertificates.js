import { useEffect } from "react"
import { useCertificatesStore } from "../../../store/useCertificatesStore"

export function useCertificates() {
  const { certificates, loading, fetchCertificates } = useCertificatesStore()

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  const refresh = () => fetchCertificates(true)

  return { certificates, loading, refresh }
}
