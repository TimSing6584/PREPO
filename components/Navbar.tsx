'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 px-8 py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#101010] rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-400 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#101010]">PREPO</span>
        </div>

        {/* Navigation Pills */}
        <div className="hidden lg:flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
          <Link href="#services" className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all">Services</Link>
          <Link href="#preview" className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all">Preview</Link>
          <Link href="#about" className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all">About</Link>
          <Link href="#landing-page-footer" className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all">Contact us</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/get-started" 
            className="flex items-center gap-2 bg-[#101010] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black/90 transition-all group"
          >
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
              <ArrowUpRight className="w-3 h-3 text-white" />
            </div>
            Let's Connect
          </Link>
        </div>
      </div>
    </nav>
  )
}