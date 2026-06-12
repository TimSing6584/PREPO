'use client'
import Navbar from '@/components/main/Navbar'
import Image from 'next/image'
import { useState } from 'react'
const SLOGANS = [
  'Sharpening your questions…',
  'Good things take a second…',
  'Fetching wisdom from the woods…',
  'Almost there, stay sharp…',
  'Loading your next challenge…',
] as const

export default function LoadingScreen() {
  const [slogan] = useState(
    () => SLOGANS[Math.floor(Math.random() * SLOGANS.length)]
  )
  return (
    <div className="main-frame px-4 sm:px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-3 sm:gap-4 md:gap-6 font-geist-sans">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="mascot-ring">
          <div className="w-52 h-52 rounded-full bg-white flex items-center justify-center">
            <Image
              src="/mascot/Prepo_Mascot_Animation.webp"
              alt="Loading"
              width={150}
              height={150}
              priority
              unoptimized
            />
          </div>
        </div>

        <p className="text-sm font-semibold text-primary-800 tracking-wide">
          {slogan}
        </p>
      </div>
    </div>
  )
}
