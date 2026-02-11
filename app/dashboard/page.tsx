'use client'

import Navbar from '@/components/dashboard/Navbar'
import { 
  Zap, 
  FileText, 
  Code, 
  Cpu, 
  Globe, 
  Database, 
  Layers,
  ArrowRight
} from 'lucide-react'

const topics = [
  { name: 'OOP', icon: Code },
  { name: 'Operating System', icon: Cpu },
  { name: 'Computer Network', icon: Globe },
  { name: 'Database', icon: Database },
  { name: 'Data Structure & Algo Theories', icon: Layers },
]

export default function DashboardPage() {
  return (
    <div className="main-frame p-6 md:p-12 relative overflow-hidden flex flex-col gap-8 md:gap-12 font-geist-sans">
        {/* Header */}
        <Navbar />

        {/* Content Container */}
        <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-10 z-10">
          
          {/* Hero Banner */}
          <div className="space-y-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#101010] tracking-tight text-center mx-auto">
              Hello, what do you want to master ?
            </h1>
           
            {/* Practice Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* MCQ Card */}
              <div className="group relative bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Zap className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-[#101010]">Multiple Choice Question</h2>
                    <p className="text-neutral-500 text-base leading-relaxed max-w-xs">
                      Best for fast practice before interview
                    </p>
                  </div>
                  <div className="self-end p-3 rounded-full bg-primary-50 text-alert-500 group-hover:bg-primary-100 transition-colors">
                     <Zap className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* Written Question Card */}
              <div className="group relative bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <FileText className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-[#101010]">Written Question</h2>
                    <p className="text-neutral-500 text-base leading-relaxed max-w-xs">
                      Best for practice memory
                    </p>
                  </div>
                  <div className="self-end p-3 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors">
                     <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="space-y-8">
            <h3 className="text-xl font-medium text-neutral-400 uppercase tracking-wider pl-2">Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.map((topic) => (
                <div 
                  key={topic.name} 
                  className="group bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:bg-primary-50/10 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 h-full aspect-[4/3] md:aspect-auto"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-sm transition-all text-neutral-600">
                      <topic.icon className="w-7 h-7" />
                    </div>
                    <span className="text-xl font-bold text-[#101010] group-hover:text-black leading-tight block">
                      {topic.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-400 group-hover:text-primary-600 transition-colors">
                    Start now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary-100/30 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
    </div>
  )
}
