'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Zap, Star, Sparkles, Mic, PenLine } from 'lucide-react'

const SlideChooseTopic = () => (
  <div className="w-full lg:flex-1 lg:h-full relative flex items-center justify-center shrink-0">
    <div className="absolute inset-0 bg-primary-500/5 blur-3xl rounded-full" />
    <div className="relative flex flex-col gap-2 sm:gap-3 w-full max-w-[13rem] sm:max-w-56 2xl:max-w-72">
      {[
        { label: 'Object-Oriented Programming', color: 'bg-indigo-500' },
        { label: 'Operating Systems', color: 'bg-rose-500' },
        { label: 'Computer Networks', color: 'bg-sky-500' },
        { label: 'Databases', color: 'bg-cyan-500' },
        { label: 'Data Structures & Algorithms', color: 'bg-purple-500'}
      ].map((topic, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm transition-all ${i === 1 ? 'scale-105 border-white/30 bg-white/15' : ''}`}
        >
          <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${topic.color} shrink-0`} />
          <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-white/80 leading-tight">{topic.label}</span>
        </div>
      ))}
    </div>
  </div>
)

const SlidePractice = () => (
  <div className="w-full lg:flex-1 lg:h-full relative flex items-center justify-center shrink-0">
    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
    <div className="relative w-full max-w-[16rem] sm:max-w-64 2xl:max-w-80 flex flex-col gap-2 sm:gap-3">
      <div className="px-4 py-3 rounded-2xl bg-white/8 border border-white/10 text-sm 2xl:text-base font-semibold text-white/90">
        What is polymorphism?
      </div>
      <div className="flex flex-col gap-2">
        {['The ability to take many forms', 'A type of inheritance', 'A design pattern', 'A memory model'].map((opt, i) => (
          <div
            key={i}
            className={`px-4 py-2.5 rounded-xl border text-xs 2xl:text-sm font-medium transition-all ${
              i === 0
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                : i === 2
                ? 'border-red-500 bg-red-500/15 text-red-300'
                : 'border-white/10 bg-white/5 text-white/50'
            }`}
          >
            {opt}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="text-xs 2xl:text-sm text-emerald-400 font-semibold">Correct!</span>
        <span className="ml-auto text-xs 2xl:text-sm text-white/30 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Starred
        </span>
      </div>
    </div>
  </div>
)

const SlidePersonalized = () => (
  <div className="w-full lg:flex-1 lg:h-full relative flex items-center justify-center shrink-0">
    <div className="absolute inset-0 bg-violet-500/5 blur-3xl rounded-full" />
    <div className="relative w-full max-w-[16rem] sm:max-w-64 2xl:max-w-80 flex flex-col gap-2 sm:gap-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
        <span className="text-xs 2xl:text-sm font-semibold text-amber-300">3 starred questions</span>
      </div>
      <div className="px-4 py-3 rounded-2xl bg-white/8 border border-white/10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-primary-400 shrink-0" />
          <span className="text-xs 2xl:text-sm font-bold text-white/80 uppercase tracking-wider">My Question</span>
        </div>
        <p className="text-sm 2xl:text-base text-white/70">Explain the difference between a process and a thread.</p>
        <div className="flex gap-2 mt-1">
          <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-xs 2xl:text-sm font-semibold">OS</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-xs 2xl:text-sm">Visible only to you</span>
        </div>
      </div>
      <div className="px-4 py-2.5 rounded-xl border border-dashed border-white/20 text-xs 2xl:text-sm text-white/30 text-center">
        + Add another question
      </div>
    </div>
  </div>
)

const SlideAI = () => (
  <div className="w-full lg:flex-1 lg:h-full relative flex items-center justify-center shrink-0">
    <div className="absolute inset-0 bg-fuchsia-500/5 blur-3xl rounded-full" />
    <div className="relative w-full max-w-[16rem] sm:max-w-64 2xl:max-w-80 flex flex-col gap-2 sm:gap-3">
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white/8 border border-white/10 text-xs sm:text-sm 2xl:text-base text-white/70">
        Explain the difference between a process and a thread.
      </div>
      <div className="flex flex-col items-center gap-2 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 2xl:w-16 2xl:h-16 rounded-full bg-red-500/20 border-2 border-red-400/60 flex items-center justify-center">
          <Mic className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7 text-red-400" />
        </div>
        <div className="flex items-center gap-1">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-red-400/70"
              style={{ height: `${8 + Math.sin(i * 0.8) * 6}px` }}
            />
          ))}
        </div>
        <span className="text-xs 2xl:text-sm font-semibold text-red-300">Recording… 0:24</span>
      </div>
      <div className="flex gap-2 items-start">
        <div className="w-6 h-6 sm:w-7 sm:h-7 2xl:w-8 2xl:h-8 rounded-full bg-fuchsia-500/30 border border-fuchsia-400/40 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4 text-fuchsia-300" />
        </div>
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-tl-sm bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs sm:text-sm 2xl:text-base text-white/80 leading-relaxed">
          Good start — you covered isolation, but threads share the same memory space while processes don&apos;t.
        </div>
      </div>
    </div>
  </div>
)

const demoSteps = [
  {
    tag: 'Topics',
    tagColor: 'bg-primary-500',
    icon: BookOpen,
    title: 'Pick your battlefield.',
    description: 'OOP, OS, Networking, Databases — choose a topic and dive straight into questions built for Big Tech interviews.',
    visual: SlideChooseTopic,
  },
  {
    tag: 'Practice',
    tagColor: 'bg-blue-500',
    icon: Zap,
    title: 'MCQ. Written. Both.',
    description: 'Rapid-fire multiple choice or open-ended written answers. Get instant feedback and star the questions that trip you up.',
    visual: SlidePractice,
  },
  {
    tag: 'Personalized',
    tagColor: 'bg-violet-500',
    icon: PenLine,
    title: 'Make the questions yours.',
    description: 'Create your own questions for any topic, star the ones worth revisiting, and build a practice set that fits exactly how you think.',
    visual: SlidePersonalized,
  },
  {
    tag: 'AI Feedback',
    tagColor: 'bg-fuchsia-500',
    icon: Sparkles,
    title: 'Record your answer. Get AI feedback.',
    description: 'Speak your answer out loud and get instant, contextual feedback. Understand exactly where your thinking breaks down and what to improve.',
    visual: SlideAI,
  },
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
    <section id="preview" className="py-12 sm:py-16 lg:py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[100rem] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-2 sm:px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl 2xl:text-7xl font-bold text-[#101010] mb-4 sm:mb-6 tracking-tight">How Prepo Elevates Your Prep</h2>
          <p className="text-base sm:text-lg lg:text-xl 2xl:text-2xl text-gray-500 max-w-2xl 2xl:max-w-3xl mx-auto">Take a walkthrough of the platform designed to turn candidates into engineers.</p>
        </div>

        <div className="relative">
          <div className="relative mx-auto max-w-5xl 2xl:max-w-6xl bg-[#101010] rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/5 overflow-hidden">
            {/* Window chrome */}
            <div className="bg-white/5 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Carousel — auto height on mobile so stacked content isn't clipped */}
            <div className="relative lg:aspect-[21/9] 2xl:aspect-[24/9] overflow-hidden group">
              <div className="relative min-h-[28rem] sm:min-h-[26rem] lg:min-h-0 lg:absolute lg:inset-0">
              {demoSteps.map((step, index) => {
                const Visual = step.visual
                const Icon = step.icon
                return (
                  <div
                    key={index}
                    className={`${index === currentStep ? 'relative lg:absolute opacity-100 translate-x-0' : 'absolute inset-0 opacity-0 translate-x-12 pointer-events-none'} inset-0 transition-all duration-700 ease-in-out flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 lg:p-16 2xl:p-20 gap-4 sm:gap-8 lg:gap-12 2xl:gap-16`}
                  >
                    <Visual />

                    <div className="flex-1 w-full space-y-3 sm:space-y-4 lg:space-y-6 text-center lg:text-left">
                      <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full ${step.tagColor} bg-opacity-10 text-xs 2xl:text-sm font-bold uppercase tracking-widest text-white border border-white/10`}>
                        <Icon className="w-3.5 h-3.5" />
                        {step.tag}
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-5xl 2xl:text-6xl font-bold text-white tracking-tight leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg 2xl:text-xl text-gray-400 max-w-lg 2xl:max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
              </div>

              <button
                onClick={() => { prevStep(); setIsAutoPlaying(false) }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-full bg-white/10 lg:bg-white/5 border border-white/10 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:bg-white/10 backdrop-blur-sm z-10"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => { nextStep(); setIsAutoPlaying(false) }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-full bg-white/10 lg:bg-white/5 border border-white/10 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:bg-white/10 backdrop-blur-sm z-10"
                aria-label="Next step"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="bg-white/5 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-t border-white/5">
              <div className="flex gap-3">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setCurrentStep(index); setIsAutoPlaying(false) }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'w-12 bg-primary-500' : 'w-3 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-gray-500 text-xs 2xl:text-sm font-medium uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                Step {currentStep + 1} of {demoSteps.length}
              </div>
            </div>
          </div>

          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 blur-[100px] opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}