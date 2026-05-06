'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/main/Navbar'
import QuestionSidebar from '@/components/cs-fundamentals/practice/QuestionSidebar'
import QuestionCard from '@/components/cs-fundamentals/practice/QuestionCard'
import type { PracticeQuestion } from '@/components/cs-fundamentals/practice/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type PracticeClientProps = {
  topicId: string
  topicName: string
  questions: PracticeQuestion[]
  initialQuestionId: string
}

export default function PracticeClient({
  topicId,
  topicName,
  questions,
  initialQuestionId,
}: PracticeClientProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState(initialQuestionId)
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [starredIds, setStarredIds] = useState<string[]>([])

  useEffect(() => {
    setCurrentQuestionId(initialQuestionId)
  }, [initialQuestionId])

  const currentQuestion =
    questions.find((question) => question.id === currentQuestionId) || questions[0]

  const toggleStar = (id: string) => {
    setStarredIds((prev) => (prev.includes(id) ? prev.filter((starredId) => starredId !== id) : [...prev, id]))
  }

  const markCompleted = (id: string) => {
    setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-4 md:gap-6 font-geist-sans">
      <Navbar />

      <div className="flex-1 flex min-h-0 -mx-6 md:-mx-12 -mb-6 md:-mb-12">
        <div className="hidden md:block w-80 h-full flex-shrink-0 border-r border-neutral-100 bg-white/50">
          <QuestionSidebar
            questions={questions}
            currentQuestionId={currentQuestionId}
            onSelectQuestion={setCurrentQuestionId}
            completedIds={completedIds}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between px-2">
              <Link
                href={`/cs-fundamentals/${topicId}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to Questions
              </Link>

              <div className="text-xs font-medium text-neutral-400 flex items-center gap-2">
                Topic:{' '}
                <span className="text-neutral-900 uppercase tracking-wider font-bold">
                  {topicName}
                </span>
              </div>
            </div>

            {currentQuestion ? (
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                starred={starredIds.includes(currentQuestion.id)}
                onToggleStar={() => toggleStar(currentQuestion.id)}
                onCorrectAnswer={() => markCompleted(currentQuestion.id)}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
                No questions available for this topic.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

