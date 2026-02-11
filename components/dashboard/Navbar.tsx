'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="max-w-[1400px] mx-auto w-full flex justify-between items-center z-10">
      <Link href="/dashboard" className="transition-transform hover:scale-105 active:scale-95">
        <Image 
          src="/prepo-logo/prepo-logo.svg" 
          width={120} 
          height={40} 
          alt="Prepo Logo"
          className="h-10 w-auto"
        />
      </Link>
      <button className="px-8 py-2.5 rounded-full border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all font-medium text-neutral-800 bg-white shadow-sm">
        Sign In
      </button>
    </header>
  )
}
