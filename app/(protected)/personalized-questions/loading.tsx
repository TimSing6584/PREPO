import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/main/Navbar'

export default function Loading() {
  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-4 md:gap-6 font-geist-sans">
      <Navbar />
      <div className="flex-1 -mx-6 md:-mx-12 -mb-6 md:-mb-12">
        <div className="h-full overflow-y-auto p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between px-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to Dashboard
              </Link>
            </div>

            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-6 md:p-10">
              <div className="rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin" />
                  <p className="text-sm md:text-base font-semibold text-primary-800">
                    Personalized questions are loading soon
                  </p>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-8 w-64 rounded-full bg-neutral-200 animate-pulse" />
                  <div className="h-4 w-72 rounded-full bg-neutral-100 animate-pulse" />
                </div>
                <div className="h-10 w-32 rounded-lg bg-primary-100 animate-pulse" />
              </div>

              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-neutral-100 bg-neutral-50/60 px-4 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-24 rounded-full bg-neutral-200" />
                        <div className="h-4 w-20 rounded-full bg-neutral-100" />
                      </div>
                      <div className="h-4 w-5/6 rounded-full bg-neutral-200" />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="h-11 w-11 rounded-md bg-neutral-200" />
                      <div className="h-9 w-16 rounded-lg bg-blue-100" />
                      <div className="h-9 w-16 rounded-lg bg-red-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
