'use client'

import { useState } from 'react'
import { MoreHorizontal, Star } from 'lucide-react'
import { Question } from '@/data/mockData'
import MCQView from './MCQView'
import WrittenView from './WrittenView'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: Question
  starred: boolean
  onToggleStar: () => void
  onCorrectAnswer: () => void
}

export default function QuestionCard({
  question,
  starred,
  onToggleStar,
  onCorrectAnswer
}: QuestionCardProps) {
  const [mode, setMode] = useState<'mcq' | 'written'>(question.type)

  const [showStarReminder, setShowStarReminder] = useState(false)

  return (
    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8 md:p-12 h-fit min-h-[600px] flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
         <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4">
               {/* Mode Switcher */}
               <div className="bg-neutral-100 rounded-lg p-1 flex items-center gap-1">
                  <button 
                    onClick={() => setMode('mcq')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
                      mode === 'mcq' ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                    )}
                  >
                    Multiple choice
                  </button>
                  <button 
                    onClick={() => setMode('written')}
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
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#101010] leading-tight">
               {question.text}
            </h1>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {mode === 'mcq' && question.options ? (
          <MCQView 
            options={question.options} 
            correctAnswer={question.correctAnswer as number}
            onComplete={(isCorrect) => {
               if (!isCorrect) {
                 setShowStarReminder(true)
                 setTimeout(() => setShowStarReminder(false), 5000)
               } else {
                 onCorrectAnswer()
               }
            }}
          />
        ) : (
          <WrittenView correctAnswer={question.explanation || String(question.correctAnswer)} />
        )}
      </div>

    </div>
  )
}
