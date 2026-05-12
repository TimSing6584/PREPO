'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, RotateCcw, Star } from 'lucide-react'
import MCQView from './MCQView'
import WrittenView from './WrittenView'
import { cn } from '@/lib/utils'
import type { PracticeQuestion } from './types'

interface QuestionCardProps {
  question: PracticeQuestion
  starred: boolean
  onToggleStar: () => void
  onPreviousQuestion?: () => void
  onNextQuestion?: () => void
  canGoPrevious?: boolean
  canGoNext?: boolean
  onRedo?: () => void
  progress?: {
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
  onProgressChange?: (progress: {
    mode?: 'mcq' | 'written'
    mcq?: {
      selectedOption: number | null
      isSubmitted: boolean
      isCorrect: boolean | null
    }
    written?: {
      draft: string
    }
  }) => void
  currentGlobalIndex?: number
}

export default function QuestionCard({
  question,
  starred,
  onToggleStar,
  onPreviousQuestion,
  onNextQuestion,
  canGoPrevious = false,
  canGoNext = false,
  onRedo,
  progress,
  onProgressChange,
  currentGlobalIndex
}: QuestionCardProps) {
  const [mode, setMode] = useState<'mcq' | 'written'>(progress?.mode ?? 'mcq')

  const [showStarReminder, setShowStarReminder] = useState(false)

  useEffect(() => {
    setMode(progress?.mode ?? 'mcq')
  }, [progress?.mode, question.id])

  return (
    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8 md:p-12 h-fit min-h-[600px] flex flex-col relative overflow-hidden">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4">
               {/* Mode Switcher */}
              <div className="bg-neutral-100 rounded-lg p-1 flex items-center gap-1">
                  <button
                    onClick={() => {
                      setMode('mcq')
                      onProgressChange?.({ ...progress, mode: 'mcq' })
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
                      mode === 'mcq' ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    Multiple choice
                  </button>
                  <button
                    onClick={() => {
                      setMode('written')
                      onProgressChange?.({ ...progress, mode: 'written' })
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
                      mode === 'written' ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    Written
                  </button>
              </div>

              <div className="h-6 w-[1px] bg-neutral-200" />

               {/* Star Button with Reminder */}
              <div className="relative">
                <button
                    onClick={() => {
                      onToggleStar()
                      setShowStarReminder(false)
                    }}
                    className="group relative"
                >
                    <Star className={cn(
                      "w-5 h-5 transition-colors",
                      starred ? "fill-amber-400 text-amber-400" : "text-neutral-300 group-hover:text-amber-400",
                      showStarReminder && "animate-pulse text-amber-400"
                    )} />
                </button>

                {showStarReminder && !starred && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-neutral-900 text-white text-xs p-3 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
                      Tip: Star this question to review it later!
                  </div>
                )}
              </div>

              <button
                onClick={onRedo}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Redo
              </button>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#101010] leading-tight">
              Q{currentGlobalIndex}: {question.text}
            </h1>

            {question.imageUrl && (
              <div className="mt-6">
                <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50">
                  <Image
                    src={question.imageUrl}
                    alt={question.text}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {mode === 'mcq' && question.options ? (
          <MCQView
            options={question.options}
            correctAnswer={question.correctOption}
            initialSelectedOption={progress?.mcq?.selectedOption ?? null}
            initialIsSubmitted={progress?.mcq?.isSubmitted ?? false}
            onProgressChange={(mcqProgress) =>
              onProgressChange?.({
                ...progress,
                mcq: mcqProgress,
              })
            }
            onComplete={(isCorrect) => {
              if (!isCorrect) {
                setShowStarReminder(true)
                setTimeout(() => setShowStarReminder(false), 5000)
              }
            }}
          />
        ) : (
          <WrittenView
            correctAnswer={question.correctWritten}
            initialDraft={progress?.written?.draft ?? ''}
            onDraftChange={(draft) =>
              onProgressChange?.({
                ...progress,
                written: { draft },
              })
            }
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        <button
          onClick={onPreviousQuestion}
          disabled={!canGoPrevious}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onNextQuestion}
          disabled={!canGoNext}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  )
}
