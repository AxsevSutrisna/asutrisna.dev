/** Entity Certificate (kanonik). */
export interface Certificate {
  id: number | string
  img: string
  createdAt: string | null
}

export interface CertificateRow {
  id: number | string
  img?: string | null
  Img?: string | null
  created_at?: string | null
  [key: string]: unknown
}
