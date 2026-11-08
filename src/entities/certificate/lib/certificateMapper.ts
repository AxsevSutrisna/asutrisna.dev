import type { Certificate, CertificateRow } from "@/entities/certificate/model/types"

export function rowToCertificate(row: CertificateRow): Certificate {
  return {
    id: row.id,
    img: (row.img ?? row.Img ?? "").toString(),
    createdAt: row.created_at ?? null,
  }
}
