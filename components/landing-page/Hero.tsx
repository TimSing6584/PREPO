'use client'

import { ArrowUpRight, Code, Cpu, Terminal, Users } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-12 overflow-visible">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-12 items-center">
          <div className="w-full space-y-8 sm:space-y-12">
            <div className="w-full space-y-6">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/50 border border-primary-200 text-primary-700 text-sm font-bold animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Built by NTU Students
              </div> */}
              
              <h1 className="w-full text-[clamp(3rem,16.5vw,4.75rem)] sm:text-[clamp(3.25rem,13vw,4.5rem)] md:text-6xl lg:text-8xl font-bold tracking-[-0.01em] md:tracking-tight text-[#101010] leading-[1.02] sm:leading-[1.05] md:leading-[1.1] animate-fade-in-up">
                Master the <br />
                <span className="text-primary-500 underline decoration-gray-200 underline-offset-4 sm:underline-offset-6 md:underline-offset-8">Technical</span> <br />
                Interview.
              </h1>
            </div>

            <div className="space-y-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 text-lg font-bold group bg-[#101010] text-white px-8 py-4 rounded-full hover:bg-black/90 transition-all"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#101010] group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  Get Started Free
                </Link>
              </div>
              
              <div className="w-full h-px bg-gray-200"></div>

              <p className="text-gray-500 text-xl leading-relaxed">
                The all-in-one platform for you to practice CS fundamentals. Your journey to Big Tech starts here.
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-[22rem] sm:max-w-[26rem] md:max-w-none mx-auto md:mx-0 animate-scale-in overflow-visible">
            <div className="relative w-full aspect-square min-h-[16rem] sm:min-h-[18rem] md:min-h-0 flex items-center justify-center overflow-visible">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-200/30 rounded-full blur-[80px] sm:blur-[100px] opacity-50" />

              {/* Floating Card 1: DSA */}
              <div className="absolute bottom-[6%] left-[4%] w-[68%] sm:w-[72%] max-w-[18rem] bg-white border border-gray-100 rounded-2xl sm:rounded-[2.5rem] shadow-2xl rotate-2 sm:rotate-3 p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 shrink-0">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <p className="font-bold text-[#101010] text-xs sm:text-sm lg:text-base leading-tight">
                    Data Structures & Algorithms
                  </p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full" />
                  <div className="w-2/3 h-1.5 sm:h-2 bg-gray-100 rounded-full" />
                  <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full" />
                </div>
                <div className="flex -space-x-1.5 sm:-space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] sm:text-[10px] font-bold"
                    >
                      U{i}
                    </div>
                  ))}
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white bg-primary-500 text-white flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                    +2k
                  </div>
                </div>
              </div>

              {/* Floating Card 2: OOP */}
              <div className="absolute top-[6%] right-[4%] w-[52%] sm:w-[56%] max-w-[14rem] bg-[#101010] rounded-2xl sm:rounded-[2.5rem] shadow-2xl -rotate-4 sm:-rotate-6 p-4 sm:p-6 lg:p-8 text-white space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-400" />
                </div>
                <h4 className="text-sm sm:text-base lg:text-xl font-bold leading-tight">OOP Masterclass</h4>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
                  <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>Polymorphism</span>
                </div>
              </div>

              {/* Central Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 bg-white rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-center rotate-12 border border-gray-100">
                <Users className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 text-primary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
