'use client'

import { CheckCircle2, Circle, Menu } from 'lucide-react'
import { Question } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface QuestionSidebarProps {
  questions: Question[]
  currentQuestionId: string
  onSelectQuestion: (id: string) => void
  completedIds: string[]
}

export default function QuestionSidebar({
  questions,
  currentQuestionId,
  onSelectQuestion,
  completedIds
}: QuestionSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#101010]">Questions ({questions.length})</h2>
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

              {isCompleted && (
                <CheckCircle2 className={cn(
                  "w-5 h-5",
                  isActive ? "text-emerald-400" : "text-emerald-500"
                )} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
