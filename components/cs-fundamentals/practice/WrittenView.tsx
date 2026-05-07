'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import TipTapEditor from '@/components/TipTap/TipTapEditor'
import type { ComponentProps } from 'react'

interface WrittenViewProps {
  correctAnswer: string
  initialDraft?: string
  onDraftChange?: (draft: string) => void
}

type EditorContent = NonNullable<ComponentProps<typeof TipTapEditor>['initialContent']>

const hasRichTextShape = (value: unknown): value is Exclude<EditorContent, string> => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as { type?: unknown }
  return candidate.type === 'doc'
}

export default function WrittenView({
  correctAnswer,
  initialDraft = '',
  onDraftChange,
}: WrittenViewProps) {
  const [answer, setAnswer] = useState(initialDraft)
  const [showAnswer, setShowAnswer] = useState(false)

  const parsedCorrectAnswer = useMemo(() => {
    try {
      const parsed = JSON.parse(correctAnswer) as unknown
      return hasRichTextShape(parsed) ? parsed : null
    } catch {
      return null
    }
  }, [correctAnswer])

  useEffect(() => {
    setAnswer(initialDraft)
  }, [initialDraft])

  return (
    <div className="space-y-6">
      <textarea
        value={answer}
        onChange={(e) => {
          const value = e.target.value
          setAnswer(value)
          onDraftChange?.(value)
        }}
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
            {parsedCorrectAnswer ? (
              <TipTapEditor
                initialContent={parsedCorrectAnswer}
                editable={false}
                showToolbar={false}
                containerClassName="w-full border-0 bg-transparent rounded-none"
                editorClassName="min-h-0 bg-transparent p-0 text-emerald-900"
              />
            ) : (
              <p className="whitespace-pre-wrap text-emerald-900">{correctAnswer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
