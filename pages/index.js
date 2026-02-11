export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl p-8 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">Nama Anda — Portofolio</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Selamat datang di portofolio saya. Ini adalah kerangka Next.js + Tailwind.</p>
        <div className="mt-6">
          <a href="#projects" className="inline-block px-5 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">Lihat Proyek</a>
        </div>
      </div>
    </main>
  )
}
