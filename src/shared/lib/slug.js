/**
 * Sumber TUNGGAL untuk slug project.
 *
 * Sengaja plain JS (bukan .ts) tanpa alias agar bisa diimpor baik oleh app
 * graph (Vite) MAUPUN oleh `scripts/generate-sitemap.mjs` (Node ESM) tanpa
 * build step. Slug WAJIB byte-identical di kedua tempat supaya canonical URL
 * dan sitemap tidak divergen. Jangan ubah algoritme tanpa memutakhirkan sitemap.
 */
export const toSlug = (title) =>
  String(title ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
