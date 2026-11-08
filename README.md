# Portofolio Asep Sutrisna Suhada Putra

Website personal portofolio untuk menampilkan profil, pengalaman, proyek, sertifikat, dan informasi kontak dalam satu halaman yang modern dan responsif. Project ini juga terhubung ke dashboard admin sehingga data dapat diubah secara dinamis tanpa perlu mengedit source code secara manual setiap saat.

## Tentang Project

Portofolio ini dibuat sebagai personal branding sekaligus pusat informasi profesional. Website publik digunakan untuk menampilkan identitas dan karya, sedangkan dashboard admin digunakan untuk mengelola konten seperti data profil, proyek, sertifikat, komentar, sosial media, tema, dan bagian lain yang tampil di halaman utama.

## Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS
- **Bahasa:** JavaScript + TypeScript (migrasi bertahap — lihat [Bahasa & TypeScript](#bahasa--typescript))
- **UI & Component Library:** Material UI, Radix UI, Headless UI, shadcn/ui, Lucide Icons
- **Animation & Interaction:** Framer Motion, GSAP, AOS, React Spring, Typewriter Effect, @hello-pangea/dnd (drag & drop)
- **Routing & SEO:** React Router v6, React Helmet Async, sitemap generator
- **State:** Zustand
- **Backend / BaaS:** Supabase (Auth, PostgreSQL, Storage, Realtime)

## Arsitektur

Project ini memakai **Feature-Sliced Design (FSD) yang disederhanakan** dipadukan dengan **Repository pattern**. Tujuannya menjaga agar logika data terpusat, UI tetap tipis, dan skema database (snake_case) tidak bocor ke seluruh komponen.

### Aturan inti

> **Tidak ada komponen/halaman yang menyentuh `supabase` secara langsung.**
> Semua akses data (read, write, upload storage, realtime) melewati **repository per-entity** di `src/entities/<entity>/api/<entity>Repository.ts`. Satu-satunya tempat yang mengimpor `supabaseClient` adalah lapisan `entities/*/api` dan `shared/api`.

### Lapisan (impor hanya ke bawah)

```
app   →  pages  →  features  →  entities  →  shared
```

```
src/
  app/        (bertahap) composition root — untuk saat ini App.jsx + providers masih di root src/
  pages/      Komposisi tipis per-route: Home, Login, Dashboard (admin shell + screens), NotFound
  features/   Unit use-case (hooks + interaksi): <domain>-management (admin), halaman publik per fitur
  entities/   Domain bisnis. Tiap entity:
                model/   types.ts, store.ts (Zustand — hanya bila butuh state lintas-feature)
                api/     <entity>Repository.ts  (SATU-SATUNYA yang menyentuh supabase)
                lib/     mapper (HANYA bila butuh normalisasi casing/CSV — mis. project)
  shared/     api/     supabaseClient, errors (AppError/wrapError), storage (uploadFile),
                       realtime (subscribe), mapRows
              config/  env (validasi VITE_*), konstanta
              lib/     util & hook generik (slug, dsb.)
              ui/      design system (components/ui)
  components/ Chrome & komponen UI lama (Navbar, Footer, Background, layouts) — direlokasi bertahap
```

### Pola per-domain

Setiap domain mengikuti pola yang sama:

- `entities/<e>/model/types.ts` — tipe domain
- `entities/<e>/api/<e>Repository.ts` — read + write + upload + realtime, melempar `AppError`
- `entities/<e>/lib/<e>Mapper.ts` — **opsional**, hanya untuk domain "kotor" (casing/CSV tidak konsisten, mis. `project`). Domain yang sudah bersih snake_case sengaja **tanpa** mapper (hindari over-engineering)
- `features/<e>-management/model/use<E>.ts` — hook use-case admin (CRUD + toast)
- `pages/dashboard/<E>.jsx` — screen tipis yang hanya menyusun UI + memakai hook

Entity yang tersedia: `about, achievement, certificate, comment, course, education, experience, heroContent, message, project, session, socialLink, techStack, theme, themePreset`.

### Catatan khusus

- **Tema (`theme`) sengaja TIDAK di-camelCase.** Key snake_case adalah kontrak CSS variable + bentuk cache `localStorage`, jadi dipertahankan apa adanya.
- **Realtime** (theme, hero content, comments) memakai `shared/api/subscribe` yang idempoten dan aman terhadap React StrictMode (cleanup via `removeChannel`).
- **Slug** proyek di-generate dari judul (`shared/lib/slug`) dan dibagikan ke generator sitemap agar URL publik & `sitemap.xml` konsisten.

## Bahasa & TypeScript

Migrasi ke TypeScript dilakukan **bertahap** (`allowJs: true`): file lama `.js/.jsx` tetap jalan, sementara file baru (entities, repository, hook) ditulis dalam `.ts`. Tidak ada big-bang rewrite.

## Menjalankan Project

### Prasyarat

Buat file `.env` di root project:

```
VITE_SUPABASE_URL=...        # URL project Supabase
VITE_SUPABASE_ANON_KEY=...   # anon/public key Supabase
```

Generator sitemap (script Node) membaca `SUPABASE_URL` (fallback ke `VITE_SUPABASE_URL`) dan anon key yang sama.

### Perintah

```bash
npm install
npm run dev        # dev server (otomatis generate sitemap lebih dulu)
npm run build      # production build (otomatis generate sitemap lebih dulu)
npm run preview    # preview hasil build
npm run lint       # ESLint (JS/JSX + TypeScript)
npm run format     # Prettier
npm run generate:sitemap   # generate public/sitemap.xml saja
```

## Dashboard Admin

Website memiliki dashboard admin (`/dashboard`, terproteksi) untuk mengelola isi portofolio secara dinamis: menambah, mengubah, atau menghapus data yang langsung tampil di website publik. Akses dijaga oleh `entities/session` (cek autentikasi + role `admin` pada tabel `profiles`).

## Tujuan Project

- Menjadi personal portfolio yang profesional dan mudah diakses.
- Menampilkan karya dan pengalaman secara terpusat.
- Memudahkan pembaruan konten melalui dashboard admin.
- Menerapkan backend & database yang scalable dengan Supabase.
- Menjaga arsitektur tetap clean, teruji, dan mudah dikembangkan.

## Catatan

Project ini terinspirasi dari portfolio Eki Zulfar Rachman, lalu dikembangkan menjadi versi personal dengan kebutuhan dan identitas visual sendiri.
