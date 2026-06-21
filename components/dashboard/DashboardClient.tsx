'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/main/Navbar'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import {
  Zap,
  FileText,
  ArrowRight,
  Cloud,
  Smartphone,
  Laptop,
  Search,
  Settings,
  Monitor,
} from 'lucide-react'
import type { Topic } from '@/app/utils/api/topics'
import { nameToSlug } from '@/app/utils/topicSlug'

const TopicIllustration = ({ id }: { id: string }) => {
  switch (id) {
    case 'oop':
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 relative overflow-hidden flex items-center justify-center">
          <div className="relative z-10 flex flex-col items-center gap-2 transform translate-y-2">
            <div className="w-24 h-12 bg-blue-500 rounded-lg shadow-xl shadow-blue-900/50 flex flex-col gap-1.5 p-2 border-t border-blue-400">
              <div className="w-8 h-1.5 bg-blue-200/50 rounded-full" />
              <div className="w-16 h-1.5 bg-blue-200/30 rounded-full" />
            </div>
            <div className="relative w-32 h-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-indigo-300/50" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-300/50" />
              <div className="absolute bottom-0 left-0 w-0.5 h-2 bg-indigo-300/50" />
              <div className="absolute bottom-0 right-0 w-0.5 h-2 bg-indigo-300/50" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-indigo-300/50" />
            </div>
            <div className="flex gap-3">
              <div className="w-16 h-10 bg-sky-500 rounded-lg shadow-lg border-t border-sky-400 flex flex-col gap-1 p-1.5">
                <div className="w-3 h-3 rounded-full bg-sky-200/50" />
                <div className="w-10 h-1 bg-sky-900/20 rounded-full" />
              </div>
              <div className="w-16 h-10 bg-emerald-500 rounded-lg shadow-lg border-t border-emerald-400 flex flex-col gap-1 p-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-200/50" />
                <div className="w-10 h-1 bg-emerald-900/20 rounded-full" />
              </div>
              <div className="w-16 h-10 bg-orange-500 rounded-lg shadow-lg border-t border-orange-400 flex flex-col gap-1 p-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-200/50" />
                <div className="w-10 h-1 bg-orange-900/20 rounded-full" />
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full" />
        </div>
      )
    case 'os':
      return (
        <div className="w-full h-full bg-gradient-to-br from-red-900 via-rose-900 to-orange-900 relative overflow-hidden flex items-center justify-center">
          <div className="relative z-10 flex items-end gap-2 translate-y-4">
            <div className="absolute -top-12 -left-12 opacity-20">
              <Settings className="w-32 h-32 text-orange-200 animate-spin-slow" />
            </div>
            <div className="relative z-20 translate-x-4">
              <Laptop className="w-32 h-32 text-blue-200 drop-shadow-2xl" strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center pt-2 pl-4 pb-6">
                <div className="bg-slate-800 w-20 h-14 rounded flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                  <Settings className="w-10 h-10 text-blue-400 animate-spin-slow duration-5000" strokeWidth={1.5} />
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -top-8 z-10">
              <Monitor className="w-40 h-40 text-slate-300/80 transform rotate-6" strokeWidth={0.5} />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full" />
        </div>
      )
    case 'net':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-900 relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
            <Cloud className="w-20 h-20 text-sky-300 fill-sky-500/20 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" strokeWidth={1.5} />
          </div>
          <svg className="absolute inset-0 w-full h-full z-10 stroke-orange-400/80 stroke-[1.5]" style={{ filter: 'drop-shadow(0 0 2px orange)' }}>
            <path d="M 50% 35% L 25% 70%" fill="none" />
            <path d="M 50% 35% L 50% 75%" fill="none" />
            <path d="M 50% 35% L 75% 70%" fill="none" />
          </svg>
          <div className="absolute bottom-8 w-full flex justify-center items-end gap-8 px-8 z-20">
            <Laptop className="w-12 h-12 text-blue-300" strokeWidth={1.5} />
            <Smartphone className="w-8 h-8 text-blue-300" strokeWidth={1.5} />
            <div className="w-10 h-14 border-2 border-blue-300 rounded-lg bg-blue-900/50" />
          </div>
        </div>
      )
    case 'db':
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 relative overflow-hidden flex items-center justify-center">
          <div className="relative z-10 ml-4 mt-4">
            <div className="relative flex flex-col -space-y-4">
              <div className="w-24 h-12 bg-cyan-600 rounded-[100%] border-4 border-cyan-300 shadow-lg z-30" />
              <div className="w-24 h-16 bg-gradient-to-b from-cyan-600 to-cyan-800 border-x-4 border-cyan-300 translate-y-[-24px] z-20" />
              <div className="w-24 h-12 bg-cyan-800 rounded-[100%] border-4 border-cyan-300 -mt-12 z-20" />
              <div className="w-24 h-16 bg-gradient-to-b from-cyan-600 to-cyan-800 border-x-4 border-cyan-300 translate-y-[-24px] z-10" />
              <div className="w-24 h-12 bg-cyan-800 rounded-[100%] border-4 border-cyan-300 -mt-12 z-10" />
            </div>
            <div className="absolute bottom-0 -right-8 transform translate-x-2 translate-y-2">
              <Search className="w-20 h-20 text-white drop-shadow-xl stroke-[3]" />
              <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 rounded-full blur-sm" />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full" />
        </div>
      )
    default:
      return null
  }
}

export default function DashboardClient({ topics }: { topics: Topic[] }) {
  const { user } = useKindeBrowserClient()

  const name =
    user?.given_name ||
    user?.family_name ||
    (user?.email ? user.email.split('@')[0] : null)

  const greetingBase = useMemo(() => {
    const hour = new Date().getHours()
    const timeOfDay =
      hour < 5 ? 'night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 22 ? 'evening' : 'night'

    const timeGreeting =
      timeOfDay === 'morning' ? 'Good morning' : timeOfDay === 'afternoon' ? 'Good afternoon' : timeOfDay === 'evening' ? 'Good evening' : 'Good night'

    const templates = [
      `${timeGreeting}`,
      `Welcome back`,
      `${timeGreeting} - ready to level up?`,
      `Let's make progress today`,
      `Back at it - love to see it`,
      `Small steps, big wins`,
    ]

    const dayKey = new Date().toDateString()
    const seedStr = `${user?.id ?? 'anon'}|${dayKey}|${timeOfDay}`
    let hash = 0
    for (let i = 0; i < seedStr.length; i++) hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0
    const idx = templates.length ? hash % templates.length : 0
    return templates[idx] ?? 'Welcome back'
  }, [user?.id])

  const greetingText = useMemo(() => {
    if (!name) return `${greetingBase}.`
    return `${greetingBase}, ${name}.`
  }, [greetingBase, name])

  const [typedCount, setTypedCount] = useState(0)

  useEffect(() => {
    setTypedCount(0)
    const speedMs = 28
    const id = window.setInterval(() => {
      setTypedCount((prev) => {
        if (prev >= greetingText.length) {
          window.clearInterval(id)
          return prev
        }
        return prev + 1
      })
    }, speedMs)
    return () => window.clearInterval(id)
  }, [greetingText])

  return (
    <div className="main-frame px-4 sm:px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-6 sm:gap-8 md:gap-12 font-geist-sans">
      <Navbar />

      <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-10 z-10">
        <div className="space-y-6">
          <div className="text-center mx-auto space-y-3">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#101010] tracking-tight">
              {(() => {
                const typed = greetingText.slice(0, typedCount)
                if (!name) return typed
                const nameStart = greetingText.indexOf(`, ${name}.`)
                const nameTokenStart = nameStart >= 0 ? nameStart + 2 : -1
                const nameTokenEnd = nameTokenStart >= 0 ? nameTokenStart + name.length : -1
                if (nameTokenStart < 0) return typed
                const beforeName = typed.slice(0, nameTokenStart)
                const typedName = typed.slice(nameTokenStart, nameTokenEnd)
                const afterName = typed.slice(nameTokenEnd)
                return (
                  <>
                    {beforeName}
                    {typedName ? <span className="text-primary-500">{typedName}</span> : null}
                    {afterName}
                  </>
                )
              })()}
              {typedCount < greetingText.length ? <span className="inline-block w-[0.6ch] align-baseline animate-pulse">|</span> : null}
            </h1>
            <p className="text-lg md:text-2xl text-neutral-500 font-semibold">What do you want to master?</p>
            <div className="pt-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Link
                  href="/personalized-questions/create"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                >
                  + Create your own personalized question
                </Link>
                <Link
                  href="/personalized-questions"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
                >
                  Manage personalized questions
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="group relative bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Zap className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-[#101010]">Multiple Choice Question</h2>
                  <p className="text-neutral-500 text-base leading-relaxed max-w-xs">Best for fast practice before interview</p>
                </div>
                <div className="self-end p-3 rounded-full bg-primary-50 text-alert-500 group-hover:bg-primary-100 transition-colors">
                  <Zap className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="group relative bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <FileText className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-[#101010]">Open-ended Quiz</h2>
                  <p className="text-neutral-500 text-base leading-relaxed max-w-xs">Best for practice memory</p>
                </div>
                <div className="self-end p-3 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-medium text-neutral-400 uppercase tracking-wider pl-2">Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {topics.map((topic) => (
              <Link
                href={`/cs-fundamentals/${nameToSlug(topic.name)}`}
                key={topic.id}
                className="group bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {topic.imageUrl ? (
                    <Image
                      src={topic.imageUrl}
                      alt={topic.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <TopicIllustration id={topic.id} />
                  )}
                </div>
                <div className="p-6 flex flex-col gap-4 items-center text-center">
                  <span className="text-2xl font-bold text-[#101010] group-hover:text-black leading-tight">{topic.name}</span>
                  <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-100 text-neutral-600 font-medium group-hover:bg-primary-50 group-hover:text-primary-600 transition-all duration-300">
                    Start now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
            {topics.length === 0 ? (
              <div className="col-span-full text-center text-sm text-neutral-400 py-10">No topics found.</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary-100/30 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
    </div>
  )
}
