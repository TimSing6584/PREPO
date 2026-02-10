'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowUpRight, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Preview', href: '#preview' },
    { name: 'About', href: '#about' },
    { name: 'Contact us', href: '#landing-page-footer' },
  ]

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 px-6 sm:px-8 py-4 bg-gray-50/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#101010] rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-400 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#101010]">PREPO</span>
        </div>

        {/* Navigation Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            href="/get-started" 
            className="hidden sm:flex items-center gap-2 bg-[#101010] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black/90 transition-all group"
          >
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
              <ArrowUpRight className="w-3 h-3 text-white" />
            </div>
            Get Started Free
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-200/50 transition-colors text-gray-600"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`
        lg:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-gray-50/98 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-xl transition-all duration-300 origin-top
        ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMenuOpen(false)}
              className="px-6 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-black hover:bg-white transition-all border border-transparent hover:border-gray-100"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-gray-200/50 my-2" />
          <Link 
            href="/get-started" 
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between bg-[#101010] text-white px-6 py-4 rounded-xl text-base font-medium hover:bg-black transition-all group"
          >
            Get Started Free
            <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </nav>
  )
}