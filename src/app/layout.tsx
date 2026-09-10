import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })

export const metadata: Metadata = {
  title: 'Echo',
  description: 'A quiet place to reflect.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased relative overflow-x-hidden">
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-32 w-[34rem] h-[34rem] rounded-full bg-amber-200/45 blur-3xl animate-drift" />
          <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-rose-200/35 blur-3xl animate-drift-slow" />
          <div className="absolute bottom-[-8rem] left-1/4 w-[28rem] h-[28rem] rounded-full bg-orange-100/45 blur-3xl animate-drift" />
        </div>
        <div className="fixed inset-0 -z-10 grain-overlay pointer-events-none" />
        {children}
      </body>
    </html>
  )
}
