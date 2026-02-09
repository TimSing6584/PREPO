import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prepo - Master Technical Interviews',
  description: 'Practice technical interview questions and ace your next coding interview',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}