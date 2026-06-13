'use client'

import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/main/Navbar'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function ByePage() {
  const mascotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mascotRef.current
    if (!el) return

    const applyPeek = () => {
      const isMobile = window.matchMedia('(max-width: 639px)').matches
      const offset = isMobile ? '-45%' : '-59%'
      el.style.transform = `translateX(-50%) translateY(${offset})`
    }

    const initialTimer = setTimeout(applyPeek, 600)

    return () => clearTimeout(initialTimer)
  }, [])

  return (
    <div className="main-frame px-4 sm:px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-6 sm:gap-8 md:gap-12 font-geist-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center mt-6 sm:mt-9 px-2 pt-4 sm:pt-0">
        <div className="relative w-full max-w-2xl">
          {/* Mascot — slides up from behind the bye-bye card */}
          <div
            ref={mascotRef}
            className="absolute left-1/2 z-10 w-28 md:w-40 pointer-events-none"
            style={{
              bottom: 'calc(100% - 1.25rem)',
              transform: 'translateX(-50%) translateY(100%)',
              transition: 'transform 1.1s cubic-bezier(0.34, 1.2, 0.64, 1)',
            }}
          >
            <Image
              src="/mascot/Prepo_Mascot_Bye_Animation.webp"
              alt="Prepo mascot waving goodbye"
              width={160}
              height={160}
              unoptimized
              draggable={false}
              className="w-full h-auto"
            />
          </div>

          {/* Card — mascot stands on this */}
          <div className="w-full bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8 md:p-12 text-center space-y-6 relative z-20">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-[#101010] tracking-tight">
                Bye bye
              </h1>
              <p className="text-neutral-500 text-base md:text-lg">
                You are signed out. Come back anytime.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <LoginLink className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#101010] text-white font-semibold hover:bg-black/90 transition-all">
                Sign in again
              </LoginLink>

              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3 rounded-full border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all font-semibold text-neutral-800 bg-white"
              >
                Go to Home
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
