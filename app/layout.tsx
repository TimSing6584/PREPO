import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './AuthProvider'

export const metadata: Metadata = {
  title: {
    default: 'Prepo - Master Technical Interviews',
    template: '%s | Prepo',
  },
  description: 'Practice technical interview questions and ace your next coding interview',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}