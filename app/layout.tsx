import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

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
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#101010',
              color: '#fff',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}