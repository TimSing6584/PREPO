import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  )
}