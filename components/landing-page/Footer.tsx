'use client'

import Link from 'next/link'
import { Linkedin, Github, Twitter, Instagram, Mail, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer id = "landing-page-footer"className="pt-24 pb-12 px-12 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8 col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#101010] rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-primary-400 rounded-sm"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#101010]">PREPO</span>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm">
              Empowering the next generation of software engineers to ace their technical interviews with AI-driven mentorship.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 lg:col-span-3 gap-12">
            <div className="space-y-8">
              <h4 className="font-bold text-[#101010] uppercase tracking-widest text-xs">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="#preview" className="hover:text-black transition-colors">Preview</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Resources</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-bold text-[#101010] uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="#about" className="hover:text-black transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-bold text-[#101010] uppercase tracking-widest text-xs">Stay Updated</h4>
              <form className="space-y-4">
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                  />
                  <button type="submit" className="absolute right-2 top-2 p-1.5 bg-[#101010] text-white rounded-xl hover:bg-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">Join 2,000+ students getting interview tips weekly.</p>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-200 gap-8">
          <div className="flex items-center gap-6">
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} Prepo Platform.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Mail className="w-3.5 h-3.5" /> contact@prepo.app
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="p-2 bg-white rounded-xl border border-gray-100 hover:text-primary-500 transition-colors shadow-sm">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white rounded-xl border border-gray-100 hover:text-primary-500 transition-colors shadow-sm">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white rounded-xl border border-gray-100 hover:text-primary-500 transition-colors shadow-sm">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}