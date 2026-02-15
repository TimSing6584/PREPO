'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface WrittenViewProps {
  correctAnswer: string
}

export default function WrittenView({
  correctAnswer
}: WrittenViewProps) {
  const [answer, setAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="space-y-6">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-40 p-4 rounded-xl border-2 border-neutral-200 focus:border-blue-500 focus:ring-0 resize-none transition-all placeholder:text-neutral-400"
      />

      <div className="space-y-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>

        {showAnswer && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-sm font-bold text-emerald-800 mb-2 uppercase tracking-wide">Model Answer</h4>
            <p className="text-emerald-900 leading-relaxed text-sm">
              {correctAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
