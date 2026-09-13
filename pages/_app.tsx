import type { AppProps } from 'next/app'
import { Sora, Manrope } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'

// Display font for headings — geometric, modern, distinctive
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

// Body font — clean and highly readable
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${sora.variable} ${manrope.variable}`}>
      <Component {...pageProps} />
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font-manrope), sans-serif' } }} />
    </div>
  )
}