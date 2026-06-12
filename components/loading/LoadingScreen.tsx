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

      <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6">
        <div className="mascot-ring">
          <div className="w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-white flex items-center justify-center">
            <Image
              src="/mascot/Prepo_Mascot_Animation.webp"
              alt="Loading"
              width={150}
              height={150}
              priority
              unoptimized
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-[150px] md:h-[150px]"
            />
          </div>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-primary-800 tracking-wide px-4 text-center">
          {slogan}
        </p>
      </div>
    </div>
  )
}
