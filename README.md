# Portofolio Asep Sutrisna Suhada Putra

Website personal portofolio untuk menampilkan profil, pengalaman, proyek, sertifikat, dan informasi kontak dalam satu halaman yang modern dan responsif. Project ini juga terhubung ke dashboard admin sehingga data dapat diubah secara dinamis tanpa perlu mengedit source code secara manual setiap saat.

## Tentang Project

Portofolio ini dibuat sebagai personal branding sekaligus pusat informasi profesional. Website publik digunakan untuk menampilkan identitas dan karya, sedangkan dashboard admin digunakan untuk mengelola konten seperti data profil, proyek, sertifikat, komentar, sosial media, dan bagian lain yang tampil di halaman utama.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **UI & Component Library:** Material UI, Radix UI, Headless UI, shadcn/ui, Lucide Icons
- **Animation & Interaction:** Framer Motion, GSAP, AOS, React Spring, Typewriter Effect
- **Routing & SEO:** React Router, React Helmet Async, sitemap generator
- **Backend / BaaS:** Supabase
- **Database:** Supabase PostgreSQL

## Frontend

Bagian frontend dibangun dengan React + Vite untuk menghasilkan tampilan yang cepat, ringan, dan mudah dikembangkan. Antarmuka portofolio dibuat responsif untuk desktop maupun mobile, dengan fokus pada presentasi yang bersih, modern, dan mudah dibaca.

Frontend ini mencakup:

- halaman utama portofolio
- halaman about, contact, dan project/portfolio
- komponen visual seperti navbar, footer, card project, sertifikat, dan loading screen
- tampilan dashboard admin untuk pengelolaan data secara dinamis

## Backend

Backend aplikasi menggunakan Supabase sebagai layanan backend utama. Supabase menangani autentikasi, penyimpanan data, dan akses database sehingga aplikasi dapat melakukan read/write data secara dinamis dari dashboard admin.

Dengan pendekatan ini, data portofolio bisa diperbarui melalui dashboard tanpa harus melakukan perubahan langsung pada kode frontend.

## Database

Database yang digunakan adalah **Supabase PostgreSQL**. Database ini menyimpan data yang dipakai oleh website dan dashboard admin, seperti:

- data profil
- data proyek
- data sertifikat
- data komentar
- data pengalaman kerja
- data social links

## Dashboard Admin

Website ini memiliki koneksi ke dashboard admin yang berfungsi untuk mengelola isi portofolio secara dinamis. Admin dapat menambah, mengubah, atau menghapus data yang kemudian langsung ditampilkan pada website publik sesuai kebutuhan.

Fitur dashboard admin mencakup pengelolaan konten yang terstruktur agar update data lebih efisien dan konsisten.

## Tujuan Project

- Menjadi personal portfolio yang profesional dan mudah diakses.
- Menampilkan karya dan pengalaman secara terpusat.
- Memudahkan pembaruan konten melalui dashboard admin.
- Menerapkan sistem backend dan database yang scalable dengan Supabase.

## Catatan

Project ini terinspirasi dari portfolio Eki Zulfar Rachman, lalu dikembangkan menjadi versi personal dengan kebutuhan dan identitas visual sendiri.