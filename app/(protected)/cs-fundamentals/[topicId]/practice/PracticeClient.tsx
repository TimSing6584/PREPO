'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/main/Navbar'
import QuestionSidebar from '@/components/cs-fundamentals/practice/QuestionSidebar'
import QuestionCard from '@/components/cs-fundamentals/practice/QuestionCard'
import type { PracticeQuestion } from '@/components/cs-fundamentals/practice/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type PracticeClientProps = {
  userId: string
  topicId: string
  topicName: string
  questions: PracticeQuestion[]
  initialQuestionId: string
}

type StoredQuestionProgress = {
  mode?: 'mcq' | 'written'
  mcq?: {
    selectedOption: number | null
    isSubmitted: boolean
    isCorrect: boolean | null
  }
  written?: {
    draft: string
  }
}

type PracticeProgressStore = {
  questions: Record<string, StoredQuestionProgress>
  updatedAt: number
  expiresAt: number
}

const PRACTICE_PROGRESS_TTL_MS = 15 * 24 * 60 * 60 * 1000
const storageKeyForTopic = (userId: string, topicId: string) => `practiceProgress:v2:${userId}:${topicId}`
const warningDismissedKeyForTopic = (userId: string, topicId: string) => `practiceProgressWarningDismissed:v1:${userId}:${topicId}`

export default function PracticeClient({
  userId,
  topicId,
  topicName,
  questions,
  initialQuestionId,
}: PracticeClientProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState(initialQuestionId)
  const [progressByQuestion, setProgressByQuestion] = useState<Record<string, StoredQuestionProgress>>({})
  const [starredIds, setStarredIds] = useState<string[]>([])
  const [hasHydratedProgress, setHasHydratedProgress] = useState(false)
  const [showTtlNotice, setShowTtlNotice] = useState(true)

  useEffect(() => {
    setCurrentQuestionId(initialQuestionId)
  }, [initialQuestionId])

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(warningDismissedKeyForTopic(userId, topicId))
      setShowTtlNotice(dismissed !== 'true')
    } catch {
      setShowTtlNotice(true)
    }
  }, [topicId, userId])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKeyForTopic(userId, topicId))
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PracticeProgressStore>
        const now = Date.now()
        const expiresAt = typeof parsed.expiresAt === 'number' ? parsed.expiresAt : 0

        if (expiresAt > now) {
          setProgressByQuestion(parsed.questions ?? {})
        } else {
          localStorage.removeItem(storageKeyForTopic(userId, topicId))
          setProgressByQuestion({})
        }
      }
    } catch {
      setProgressByQuestion({})
    } finally {
      setHasHydratedProgress(true)
    }
  }, [topicId, userId])

  useEffect(() => {
    if (!hasHydratedProgress) return
    const now = Date.now()
    const payload: PracticeProgressStore = {
      questions: progressByQuestion,
      updatedAt: now,
      expiresAt: now + PRACTICE_PROGRESS_TTL_MS,
    }
    localStorage.setItem(storageKeyForTopic(userId, topicId), JSON.stringify(payload))
  }, [hasHydratedProgress, progressByQuestion, topicId, userId])

  const currentQuestion =
    questions.find((question) => question.id === currentQuestionId) || questions[0]
  const currentQuestionIndex = currentQuestion
    ? questions.findIndex((question) => question.id === currentQuestion.id)
    : -1

  const completedIds = questions
    .filter((question) => {
      const progress = progressByQuestion[question.id]
      const hasSubmittedMcq = progress?.mcq?.isSubmitted === true
      const hasWrittenDraft = (progress?.written?.draft ?? '').trim().length > 0
      return hasSubmittedMcq || hasWrittenDraft
    })
    .map((question) => question.id)

  const toggleStar = (id: string) => {
    setStarredIds((prev) => (prev.includes(id) ? prev.filter((starredId) => starredId !== id) : [...prev, id]))
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
            onRedoAll={() => setProgressByQuestion({})}
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

            {showTtlNotice ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 flex items-start justify-between gap-3">
                <p>Your practice progress is saved locally and will be automatically cleared after 15 days.</p>
                <button
                  type="button"
                  className="shrink-0 text-amber-700 hover:text-amber-900 transition-colors underline underline-offset-2"
                  onClick={() => {
                    setShowTtlNotice(false)
                    localStorage.setItem(warningDismissedKeyForTopic(userId, topicId), 'true')
                  }}
                >
                  Hide
                </button>
              </div>
            ) : null}

            {currentQuestion ? (
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                starred={starredIds.includes(currentQuestion.id)}
                onToggleStar={() => toggleStar(currentQuestion.id)}
                onPreviousQuestion={() => {
                  if (currentQuestionIndex <= 0) return
                  setCurrentQuestionId(questions[currentQuestionIndex - 1].id)
                }}
                onNextQuestion={() => {
                  if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length - 1) return
                  setCurrentQuestionId(questions[currentQuestionIndex + 1].id)
                }}
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={currentQuestionIndex >= 0 && currentQuestionIndex < questions.length - 1}
                onRedo={() =>
                  setProgressByQuestion((prev) => {
                    const next = { ...prev }
                    delete next[currentQuestion.id]
                    return next
                  })
                }
                progress={progressByQuestion[currentQuestion.id]}
                onProgressChange={(nextProgress) =>
                  setProgressByQuestion((prev) => ({
                    ...prev,
                    [currentQuestion.id]: nextProgress,
                  }))
                }
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

