'use client'

import { CheckCircle2, Menu, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PracticeQuestion } from './types'

interface QuestionSidebarProps {
  questions: PracticeQuestion[]
  currentQuestionId: string
  onSelectQuestion: (id: string) => void
  completedIds: string[]
  starredIds: string[]
  filter: 'all' | 'starred'
  onFilterChange: (filter: 'all' | 'starred') => void
  onRedoAll?: () => void
}

export default function QuestionSidebar({
  questions,
  currentQuestionId,
  onSelectQuestion,
  completedIds,
  starredIds,
  filter,
  onFilterChange,
  onRedoAll,
}: QuestionSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-[#101010]">Questions ({questions.length})</h2>
          <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => onFilterChange('all')}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-semibold transition-colors',
                filter === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900',
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('starred')}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-semibold transition-colors',
                filter === 'starred' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900',
              )}
            >
              Starred ({starredIds.length})
            </button>
          </div>
          <button
            onClick={onRedoAll}
            className="mt-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors text-left"
          >
            Redo all
          </button>
        </div>
        <Menu className="w-5 h-5 text-neutral-400 md:hidden" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {questions.map((q, index) => {
          const isActive = q.id === currentQuestionId
          const isCompleted = completedIds.includes(q.id)

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group border min-h-[64px]",
                isActive 
                  ? "bg-neutral-900 border-neutral-900 shadow-md" 
                  : "bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50"
              )}
            >
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold transition-colors",
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
                )}>
                  {index + 1}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className={cn(
                    "text-sm font-semibold truncate",
                    isActive ? "text-white" : "text-neutral-900"
                  )}>
                    {q.text}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {starredIds.includes(q.id) && (
                  <Star className={cn(
                    "w-4 h-4",
                    isActive ? "fill-amber-300 text-amber-300" : "fill-amber-400 text-amber-400"
                  )} />
                )}
                {isCompleted && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      isActive
                        ? "bg-emerald-400/20 text-emerald-300"
                        : "bg-emerald-100 text-emerald-700",
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
    </div>
  )
}
