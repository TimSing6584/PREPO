'use client'

import { CheckCircle2, ChevronLeft, ChevronRight, Menu, RotateCcw, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PracticeQuestion } from './types'
import type { PaginationMeta, QuestionFilter } from '@/app/utils/server/csFundamentals'

interface QuestionSidebarProps {
  questions: PracticeQuestion[]
  currentQuestionId: string
  onSelectQuestion: (id: string) => void
  completedIds: string[]
  starredIds: string[]
  filter: QuestionFilter
  onFilterChange: (filter: QuestionFilter) => void
  onRedoPage?: () => void
  pagination: PaginationMeta
  onPageChange: (page: number) => void
}

export default function QuestionSidebar({
  questions,
  currentQuestionId,
  onSelectQuestion,
  completedIds,
  starredIds,
  filter,
  onFilterChange,
  onRedoPage,
  pagination,
  onPageChange,
}: QuestionSidebarProps) {
  const { page, totalPages, totalCount } = pagination
  const canGoPrev = page > 1
  const canGoNext = page < totalPages

  return (
    <div className="w-full h-full flex flex-col bg-transparent">

      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-[#101010]">
            Questions ({totalCount})
          </h2>

          {/* Filter tabs (all mode only) + Redo page */}
          <div className="mt-2 flex items-center gap-2">
            {filter === 'all' && (
              <div className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 p-1">
                <button
                  type="button"
                  onClick={() => onFilterChange('all')}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs font-semibold transition-colors',
                    'bg-white text-neutral-900 shadow-sm',
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => onFilterChange('starred')}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs font-semibold transition-colors',
                    'text-neutral-500 hover:text-neutral-900',
                  )}
                >
                  Starred ({starredIds.length})
                </button>
              </div>
            )}

            {/* Redo page — green button with icon, same line */}
            <button
              type="button"
              onClick={onRedoPage}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Redo page
            </button>
          </div>
        </div>

        <Menu className="w-5 h-5 text-neutral-400 md:hidden" />
      </div>

      {/* Question list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {questions.map((q, index) => {
          const isActive = q.id === currentQuestionId
          const isCompleted = completedIds.includes(q.id)
          // Global question number across all pages
          const globalNumber = (pagination.page - 1) * pagination.pageSize + index + 1

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q.id)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group border min-h-[64px]',
                isActive
                  ? 'bg-neutral-900 border-neutral-900 shadow-md'
                  : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50',
              )}
            >
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <div
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold transition-colors',
                    isActive
                      ? 'bg-neutral-800 text-white'
                      : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200',
                  )}
                >
                  {globalNumber}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span
                    className={cn(
                      'text-sm font-semibold truncate',
                      isActive ? 'text-white' : 'text-neutral-900',
                    )}
                  >
                    {q.text}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {starredIds.includes(q.id) && (
                  <Star
                    className={cn(
                      'w-4 h-4',
                      isActive
                        ? 'fill-amber-300 text-amber-300'
                        : 'fill-amber-400 text-amber-400',
                    )}
                  />
                )}
                {isCompleted && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                      isActive
                        ? 'bg-emerald-400/20 text-emerald-300'
                        : 'bg-emerald-100 text-emerald-700',
                    )}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Done
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="py-3 border-t border-neutral-100 flex items-center justify-center gap-2">
          <button
            onClick={() => canGoPrev && onPageChange(page - 1)}
            disabled={!canGoPrev}
            className={cn(
              'group inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
              canGoPrev
                ? 'border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0'
                : 'cursor-not-allowed border-neutral-100 text-neutral-300',
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Prev
          </button>

          <span className="text-xs font-semibold text-neutral-500 tabular-nums w-20 text-center">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => canGoNext && onPageChange(page + 1)}
            disabled={!canGoNext}
            className={cn(
              'group inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
              canGoNext
                ? 'border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0'
                : 'cursor-not-allowed border-neutral-100 text-neutral-300',
            )}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  )
}
