import type { Metadata, Viewport } from 'next'
import { Inter, Lora } from 'next/font/google'
import { TabBar } from '@/components/TabBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', style: ['normal', 'italic'] })

export const metadata: Metadata = {
  title: { default: 'Echo', template: '%s · Echo' },
  description: 'A quiet journal that brings your days back to you.',
  appleWebApp: { capable: true, title: 'Echo', statusBarStyle: 'default' },
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f4f0' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-dvh bg-canvas font-sans text-label antialiased">
        <TabBar />
        <main className="mx-auto w-full max-w-[42rem] px-4 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] sm:px-6 md:pt-24 md:pb-20">
          {children}
        </main>
      </body>
    </html>
  )
}
