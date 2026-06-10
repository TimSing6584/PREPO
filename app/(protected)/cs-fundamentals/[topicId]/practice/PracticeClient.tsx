'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/main/Navbar'
import QuestionSidebar from '@/components/cs-fundamentals/practice/QuestionSidebar'
import QuestionCard from '@/components/cs-fundamentals/practice/QuestionCard'
import type { PracticeQuestion } from '@/components/cs-fundamentals/practice/types'
import {
  mergeQuestionProgress,
  type QuestionProgressPatch,
  type StoredQuestionProgress,
} from '@/components/cs-fundamentals/practice/progress'
import type { PaginationMeta, QuestionFilter } from '@/app/utils/server/csFundamentals'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type PracticeClientProps = {
  userId: string
  topicId: string
  topicName: string
  questions: PracticeQuestion[]
  orderedQuestionIds: string[]
  globalOrderedQuestionIds: string[]
  selectedQuestion: PracticeQuestion | null
  initialQuestionId: string
  pagination: PaginationMeta
  filter: QuestionFilter
}

type PracticeProgressStore = {
  questions: Record<string, StoredQuestionProgress>
  updatedAt: number
  expiresAt: number
}

const PRACTICE_PROGRESS_TTL_MS = 15 * 24 * 60 * 60 * 1000
const storageKeyForTopic = (userId: string, topicId: string) =>
  `practiceProgress:v2:${userId}:${topicId}`
const warningDismissedKeyForTopic = (userId: string, topicId: string) =>
  `practiceProgressWarningDismissed:v1:${userId}:${topicId}`

export default function PracticeClient({
  userId,
  topicId,
  topicName,
  questions,
  orderedQuestionIds,
  globalOrderedQuestionIds,
  selectedQuestion,
  initialQuestionId,
  pagination,
  filter,
}: PracticeClientProps) {
  const router = useRouter()

  const initialStarredIds = useMemo(
    () => questions.filter((q) => q.isStarred).map((q) => q.id),
    [questions],
  )

  const [currentQuestionId, setCurrentQuestionId] = useState(initialQuestionId)
  const [progressByQuestion, setProgressByQuestion] = useState<Record<string, StoredQuestionProgress>>({})
  const [starredIds, setStarredIds] = useState<string[]>(initialStarredIds)
  const [sidebarFilter, setSidebarFilter] = useState<QuestionFilter>(
    filter === 'starred' ? 'starred' : 'all',
  )
  const [hasHydratedProgress, setHasHydratedProgress] = useState(false)
  const [showTtlNotice, setShowTtlNotice] = useState(true)

  // Sync initialQuestionId when navigation changes it
  useEffect(() => {
    setCurrentQuestionId(initialQuestionId)
  }, [initialQuestionId])

  //TTL notice
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(warningDismissedKeyForTopic(userId, topicId))
      setShowTtlNotice(dismissed !== 'true')
    } catch {
      setShowTtlNotice(true)
    }
  }, [topicId, userId])

  // Hydrate progress from localStorage
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

  // Persist progress to localStorage
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

  // Sync starred when topic/questions change
  useEffect(() => {
    setStarredIds(initialStarredIds)
  }, [initialStarredIds, topicId])

  useEffect(() => {
    setSidebarFilter(filter === 'starred' ? 'starred' : 'all')
  }, [filter, topicId])

  const sidebarQuestions = useMemo(() => {
    if (filter === 'starred') return questions
    if (sidebarFilter === 'starred') {
      return questions.filter((q) => starredIds.includes(q.id))
    }
    return questions
  }, [filter, questions, sidebarFilter, starredIds])

  const globalNumberById = useMemo(
    () => Object.fromEntries(globalOrderedQuestionIds.map((id, index) => [id, index + 1])),
    [globalOrderedQuestionIds],
  )

  const questionById = useMemo(() => {
    const combinedQuestions = selectedQuestion
      ? [selectedQuestion, ...questions.filter((q) => q.id !== selectedQuestion.id)]
      : questions
    return new Map(combinedQuestions.map((q) => [q.id, q]))
  }, [questions, selectedQuestion])

  // Derived state
  const completedIds = sidebarQuestions
    .filter((q) => {
      const progress = progressByQuestion[q.id]
      return progress?.mcq?.isSubmitted === true || (progress?.written?.draft ?? '').trim().length > 0
    })
    .map((q) => q.id)

  const currentQuestion = questionById.get(currentQuestionId) ?? selectedQuestion ?? sidebarQuestions[0]
  const currentNavigationIndex = currentQuestion
    ? orderedQuestionIds.findIndex((id) => id === currentQuestion.id)
    : -1
  const currentGlobalIndex = currentQuestion
    ? globalOrderedQuestionIds.findIndex((id) => id === currentQuestion.id)
    : -1

  // Page navigation (URL-based)
  function buildUrl(page: number, f: QuestionFilter, questionId: string) {
    const qParam = questionId ? `&q=${encodeURIComponent(questionId)}` : ''
    return `/cs-fundamentals/${topicId}/practice?page=${page}&filter=${f}${qParam}`
  }

  function goToPage(page: number) {
    router.push(buildUrl(page, filter, currentQuestionId))
  }

  function handleFilterChange(newFilter: QuestionFilter) {
    if (filter === 'starred') {
      if (newFilter === 'starred') return
      const selectedIndex = currentQuestionId
        ? globalOrderedQuestionIds.findIndex((id) => id === currentQuestionId)
        : -1
      const targetPage =
        selectedIndex >= 0 ? Math.floor(selectedIndex / pagination.pageSize) + 1 : 1
      router.push(buildUrl(targetPage, 'all', currentQuestionId))
      return
    }
    setSidebarFilter(newFilter)
  }

  function selectQuestion(id: string) {
    setCurrentQuestionId(id)
    router.replace(buildUrl(pagination.page, filter, id))
  }

  // Redo current page
  function redoCurrentPage() {
    const pageQuestionIds = new Set(questions.map((q) => q.id))
    setProgressByQuestion((prev) => {
      const next = { ...prev }
      for (const id of pageQuestionIds) {
        delete next[id]
      }
      return next
    })
  }

  // Star toggle
  const toggleStar = async (id: string) => {
    const willStar = !starredIds.includes(id)
    setStarredIds((prev) => (willStar ? [...prev, id] : prev.filter((s) => s !== id)))

    try {
      const response = await fetch('/api/starred-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: id, starred: willStar }),
      })
      if (!response.ok) throw new Error('Failed to update starred question')
    } catch {
      // Revert optimistic update
      setStarredIds((prev) => (willStar ? prev.filter((s) => s !== id) : [...prev, id]))
    }
  }

  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-4 md:gap-6 font-geist-sans">
      <Navbar />

      <div className="flex-1 flex min-h-0 -mx-6 md:-mx-12 -mb-6 md:-mb-12">
        {/* Sidebar */}
        <div className="hidden md:block w-80 h-full flex-shrink-0 border-r border-neutral-100 bg-white/50">
          <QuestionSidebar
            questions={sidebarQuestions}
            currentQuestionId={currentQuestionId}
            onSelectQuestion={selectQuestion}
            completedIds={completedIds}
            starredIds={starredIds}
            filter={sidebarFilter}
            showFilterTabs
            onFilterChange={handleFilterChange}
            onRedoPage={redoCurrentPage}
            pagination={pagination}
            globalNumberById={globalNumberById}
            onPageChange={goToPage}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between px-2">
              <Link
                href={`/cs-fundamentals/${topicId}?page=${pagination.page}&filter=${filter}`}
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

            {showTtlNotice && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 flex items-start justify-between gap-3">
                <p>
                  Your practice progress is saved locally and will be automatically cleared after 15 days.
                </p>
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
            )}

            {!currentQuestion ? (
              <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50 px-4 py-10 text-center text-sm text-amber-800">
                {filter === 'starred'
                  ? 'You have no starred questions yet. Click the star icon on any question to save it for later review.'
                  : 'No starred questions on this page yet.'}
              </div>
            ) : currentQuestion ? (
              <QuestionCard
                key={currentQuestion.id}
                currentGlobalIndex={currentGlobalIndex >= 0 ? currentGlobalIndex : undefined}
                question={currentQuestion}
                starred={starredIds.includes(currentQuestion.id)}
                onToggleStar={() => toggleStar(currentQuestion.id)}
                onPreviousQuestion={() => {
                  if (currentNavigationIndex <= 0) return
                  selectQuestion(orderedQuestionIds[currentNavigationIndex - 1])
                }}
                onNextQuestion={() => {
                  if (
                    currentNavigationIndex < 0 ||
                    currentNavigationIndex >= orderedQuestionIds.length - 1
                  )
                    return
                  selectQuestion(orderedQuestionIds[currentNavigationIndex + 1])
                }}
                canGoPrevious={currentNavigationIndex > 0}
                canGoNext={
                  currentNavigationIndex >= 0 && currentNavigationIndex < orderedQuestionIds.length - 1
                }
                onRedo={() =>
                  setProgressByQuestion((prev) => {
                    const next = { ...prev }
                    delete next[currentQuestion.id]
                    return next
                  })
                }
                progress={progressByQuestion[currentQuestion.id]}
                onProgressChange={(patch: QuestionProgressPatch) =>
                  setProgressByQuestion((prev) => ({
                    ...prev,
                    [currentQuestion.id]: mergeQuestionProgress(
                      prev[currentQuestion.id],
                      patch,
                    ),
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
