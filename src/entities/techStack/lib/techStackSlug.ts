/**
 * Slug khusus tech stack (dengan .trim()), berbeda dari `shared/lib/slug`.
 * Dipertahankan apa adanya agar slug yang sudah tersimpan + uniqueness check
 * tidak berubah. Dipakai oleh form (auto-generate) dan repository (normalisasi).
 */
export const techStackSlug = (value: string): string =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
