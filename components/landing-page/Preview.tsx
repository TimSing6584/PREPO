'use client'

import { useState, useEffect, useCallback } from 'react'
import { Terminal, Shield, Zap, Star, ChevronLeft, ChevronRight, Play, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

const demoSteps = [
  {
    title: "Master Fundamentals",
    description: "Structure your learning with curated paths covering MCQ foundations to advanced system design.",
    image: "/logos/google.svg", // Using as placeholder
    tag: "Structured Learning",
    color: "bg-primary-500"
  },
  {
    title: "Real-time AI Feedback",
    description: "Get instant hints and performance analysis as you solve complex problems.",
    image: "/logos/meta.svg",
    tag: "AI Powered",
    color: "bg-blue-500"
  },
  {
    title: "Interactive MCQ Engine",
    description: "Rapid-fire testing to solidify your CS concepts and technical knowledge.",
    image: "/logos/amazon.svg",
    tag: "Concept Mastery",
    color: "bg-orange-500"
  },
  {
    title: "Progress Tracking",
    description: "Visualize your growth with detailed analytics on every technical domain.",
    image: "/logos/microsoft.svg",
    tag: "Analytics",
    color: "bg-green-500"
  },
  {
    title: "Mock Interview Mode",
    description: "Simulate real big-tech environments with timed sessions and peer reviews.",
    image: "/logos/apple.svg",
    tag: "Interview Prep",
    color: "bg-gray-500"
  }
]

export default function Preview() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length)
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextStep, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextStep])

  return (
    <section id="preview" className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 px-4">
          <h2 className="text-5xl lg:text-6xl font-bold text-[#101010] mb-6 tracking-tight">How Prepo Elevates Your Prep</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Take a walkthrough of the platform designed to turn candidates into engineers.</p>
        </div>

        <div className="relative">
          {/* Main App Mockup Frame */}
          <div className="relative mx-auto max-w-5xl bg-[#101010] rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/5 overflow-hidden">
            {/* Window Header */}
            <div className="bg-white/5 px-6 py-4 flex items-center gap-4 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>

            {/* Carousel Content */}
            <div className="relative aspect-[16/10] lg:aspect-[21/9] overflow-hidden group">
              {demoSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col lg:flex-row items-center justify-center p-8 lg:p-16 gap-12
                    ${index === currentStep ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}
                >
                  {/* Image/Visual Area */}
                  <div className="flex-1 w-full h-full relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary-500/5 blur-3xl rounded-full"></div>
                    <div className="relative w-48 h-48 lg:w-64 lg:h-64 bg-white/5 rounded-[2.5rem] border border-white/10 p-12 backdrop-blur-sm animate-float">
                      <Image 
                        src={step.image} 
                        alt={step.title}
                        fill
                        className="p-12 object-contain filter invert brightness-200"
                      />
                    </div>
                  </div>

                  {/* Text Content Area */}
                  <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${step.color} bg-opacity-10 text-xs font-bold uppercase tracking-widest text-white border border-white/10`}>
                      <span className={`w-2 h-2 rounded-full ${step.color} animate-pulse`}></span>
                      {step.tag}
                    </div>
                    <h3 className="text-3xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                      {step.description}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-6 pt-4">
                      <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition-all">
                        <Play className="w-4 h-4 fill-current" />
                        Watch Demo
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button 
                onClick={() => { prevStep(); setIsAutoPlaying(false); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 backdrop-blur-sm"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => { nextStep(); setIsAutoPlaying(false); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 backdrop-blur-sm"
                aria-label="Next step"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="bg-white/5 px-8 py-6 flex items-center justify-between border-t border-white/5">
              <div className="flex gap-3">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setCurrentStep(index); setIsAutoPlaying(false); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'w-12 bg-primary-500' : 'w-3 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                Step {currentStep + 1} of {demoSteps.length}
              </div>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 blur-[100px] opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}