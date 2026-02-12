import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
