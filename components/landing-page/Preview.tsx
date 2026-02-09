'use client'

import { Terminal, Shield, Zap, Star } from 'lucide-react'

export default function Preview() {
  return (
    <section id="preview" className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold text-[#101010] mb-6 tracking-tight">Powerful Features for Your Success</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to land your dream job in tech, wrapped in a workspace designed for focus.</p>
        </div>

        <div className="relative">
          {/* Main App Mockup */}
          <div className="relative mx-auto max-w-5xl bg-[#101010] rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/5 overflow-hidden animate-scale-in">
            {/* Window Header */}
            <div className="bg-white/5 px-6 py-4 flex items-center gap-4 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 text-xs font-medium text-gray-400 border border-white/5">
                  <Shield className="w-3.5 h-3.5" /> prepo.app/practice/two-sum
                </div>
              </div>
            </div>

            {/* App Content Interface */}
            <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column: Question */}
              <div className="lg:col-span-1 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white tracking-tight">1. Two Sum</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider">Easy</span>
                    <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-wider">Arrays</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Given an array of integers <code className="text-primary-300">nums</code> and an integer <code className="text-primary-300">target</code>, return indices of the two numbers such that they add up to target.
                  </p>
                </div>

                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-primary-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-sm font-bold uppercase tracking-widest">AI Mentor</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed italic">"Try using a HashMap to store the complement values as you iterate. This will bring your time complexity down to O(n)."</p>
                </div>
              </div>

              {/* Right Column: Code Editor */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-black/40 rounded-[2rem] border border-white/5 p-6 font-mono text-sm">
                  <div className="flex justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-400">Solution.py</span>
                    </div>
                    <span className="text-primary-400 font-bold">Python 3</span>
                  </div>
                  <pre className="text-gray-300 leading-relaxed">
                    <code>{`def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`}</code>
                  </pre>
                </div>
                <div className="flex justify-end gap-4">
                  <button className="px-6 py-3 bg-white/5 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-all border border-white/10">Run Tests</button>
                  <button className="px-6 py-3 bg-primary-500 text-white rounded-full text-sm font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20">Submit Solution</button>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Feature Cards */}
          <div className="hidden lg:block text-[#101010]">
            <div className="absolute top-20 -left-20 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-xs animate-float group hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 border border-primary-100">
                <Zap className="w-7 h-7 text-primary-500" />
              </div>
              <h4 className="font-bold text-xl mb-3 tracking-tight">Real-time Feedback</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Get instant, AI-powered suggestions as you code from our automated interview mentor.</p>
            </div>

            <div className="absolute bottom-20 -right-20 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-xs animate-float group hover:-translate-y-2 transition-transform" style={{ animationDelay: '1s' }}>
              <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center mb-6">
                <Terminal className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3 tracking-tight">System Design</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Interactive whiteboarding tools to practice large-scale architecture interviews.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}