'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'

interface MCQViewProps {
  options: string[]
  correctAnswer: number
  onComplete: (isCorrect: boolean) => void
}

export default function MCQView({
  options,
  correctAnswer,
  onComplete
}: MCQViewProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selectedOption === null) return
    setIsSubmitted(true)
    onComplete(selectedOption === correctAnswer)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === index
          const isCorrect = index === correctAnswer
          const showResult = isSubmitted

          let borderClass = "border-neutral-200"
          let bgClass = "bg-white"
          let icon = null

          if (showResult) {
            if (isCorrect) {
              borderClass = "border-emerald-500 bg-emerald-50"
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            } else if (isSelected && !isCorrect) {
              borderClass = "border-red-500 bg-red-50"
              icon = <XCircle className="w-5 h-5 text-red-500" />
            }
          } else if (isSelected) {
            borderClass = "border-blue-500 bg-blue-50"
          }

          return (
            <button
              key={index}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(index)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                borderClass,
                bgClass,
                !isSubmitted && "hover:border-blue-300"
              )}
            >
              <span className="font-medium text-neutral-700">{option}</span>
              {icon}
            </button>
          )
        })}
      </div>

      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      )}
    </div>
  )
}
