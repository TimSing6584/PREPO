'use client'

import Link from 'next/link'
import Navbar from '@/components/main/Navbar'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs'
import { ArrowLeft } from 'lucide-react'

export default function ByePage() {
  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-8 md:gap-12 font-geist-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8 md:p-12 text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-[#101010] tracking-tight">
              Bye bye
            </h1>
            <p className="text-neutral-500 text-base md:text-lg">
              You’re signed out. Come back anytime.
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
  )
}

