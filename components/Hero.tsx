'use client'

import { ArrowUpRight, Code, Cpu, Terminal, Users } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/50 border border-primary-200 text-primary-700 text-sm font-bold animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Built by NTU Students
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-bold tracking-tight text-[#101010] leading-[1.1] animate-fade-in-up">
                Master the <br />
                <span className="text-primary-500 underline decoration-gray-200 underline-offset-8">Technical</span> <br />
                Interview.
              </h1>
            </div>

            <div className="space-y-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/get-started" 
                  className="flex items-center gap-3 text-lg font-bold group bg-[#101010] text-white px-8 py-4 rounded-full hover:bg-black/90 transition-all"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#101010] group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  Get Started Free
                </Link>
                <button className="flex items-center gap-3 text-lg font-bold group border border-gray-200 px-8 py-4 rounded-full hover:bg-gray-50 transition-all">
                  Watch Demo
                </button>
              </div>
              
              <div className="w-full h-px bg-gray-200"></div>

              <p className="text-gray-500 text-xl leading-relaxed">
                The all-in-one platform for CS students to practice coding, system design, and behavioral questions. Your journey to Big Tech starts here.
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block animate-scale-in">
            {/* Visual elements inspired by the reference image but with project content */}
            <div className="relative w-full aspect-square flex items-center justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/30 rounded-full blur-[100px] opacity-50"></div>
              
              {/* Floating Card 1: Features */}
              <div className="absolute bottom-10 left-0 w-80 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl rotate-3 p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#101010]">Algorithms</p>
                    <p className="text-xs text-gray-400">500+ Questions</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                  <div className="w-2/3 h-2 bg-gray-100 rounded-full"></div>
                  <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                      U{i}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-500 text-white flex items-center justify-center text-[10px] font-bold">
                    +2k
                  </div>
                </div>
              </div>

              {/* Floating Card 2: System Design */}
              <div className="absolute top-10 right-0 w-64 bg-[#101010] rounded-[2.5rem] shadow-2xl -rotate-6 p-8 text-white space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary-400" />
                </div>
                <h4 className="text-xl font-bold leading-tight">System Design Masterclass</h4>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Terminal className="w-4 h-4" />
                  <span>Architecture</span>
                </div>
              </div>

              {/* Central Badge */}
              <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center rotate-12 border border-gray-100">
                <Users className="w-12 h-12 text-primary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
