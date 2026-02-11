'use client'

import { useState, use } from 'react'
import Navbar from '@/components/main/Navbar'
import QuestionSidebar from '@/components/cs-fundamentals/practice/QuestionSidebar'
import QuestionCard from '@/components/cs-fundamentals/practice/QuestionCard'
import { mockQuestions } from '@/data/mockData'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PracticePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params)
  const [currentQuestionId, setCurrentQuestionId] = useState(mockQuestions[0].id)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [starredIds, setStarredIds] = useState<string[]>([])

  const currentQuestion = mockQuestions.find(q => q.id === currentQuestionId) || mockQuestions[0]

  const toggleStar = (id: string) => {
    setStarredIds(prev => 
      prev.includes(id) 
        ? prev.filter(sid => sid !== id) 
        : [...prev, id]
    )
  }

  const markCompleted = (id: string) => {
    setCompletedIds(prev => prev.includes(id) ? prev : [...prev, id])
  }

  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-4 md:gap-6 font-geist-sans">
      <Navbar />

      <div className="flex-1 flex min-h-0 -mx-6 md:-mx-12 -mb-6 md:-mb-12">
        {/* Sidebar */}
        <div className="hidden md:block w-80 h-full flex-shrink-0 border-r border-neutral-100 bg-white/50">
            <QuestionSidebar 
                questions={mockQuestions}
                currentQuestionId={currentQuestionId}
                onSelectQuestion={setCurrentQuestionId}
                completedIds={completedIds}
            />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50/30">
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
                
                {/* Header info */}
                <div className="flex items-center justify-between px-2">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group">
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        Back to Dashboard
                    </Link>
                    
                    <div className="text-xs font-medium text-neutral-400 flex items-center gap-2">
                        Topic: <span className="text-neutral-900 uppercase tracking-wider font-bold">{topicId}</span>
                    </div>
                </div>

                <QuestionCard 
                    key={currentQuestion.id} // Force re-render on question change
                    question={currentQuestion}
                    starred={starredIds.includes(currentQuestion.id)}
                    onToggleStar={() => toggleStar(currentQuestion.id)}
                    onCorrectAnswer={() => markCompleted(currentQuestion.id)}
                />
            </div>
        </div>
      </div>
    </div>
  )
}
