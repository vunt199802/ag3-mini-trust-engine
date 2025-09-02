import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeScript from './theme-script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AG3 Mini Trust Engine',
  description: 'AI-powered contractor matching system with trust scoring',
  icons: {
    icon: '/logo-icon.svg',
    shortcut: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeScript />
        {children}
      </body>
    </html>
  )
}
