'use client'

import { useEffect, useMemo, useState } from 'react'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Eye, EyeOff } from 'lucide-react'

interface WrittenViewProps {
  correctAnswer: string
  initialDraft?: string
  onDraftChange?: (draft: string) => void
}

const hasRichTextShape = (value: unknown): value is JSONContent => {
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

  const answerEditor = useEditor({
    extensions: [StarterKit],
    content: parsedCorrectAnswer ?? '<p></p>',
    editable: false,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!answerEditor) return

    if (parsedCorrectAnswer) {
      answerEditor.commands.setContent(parsedCorrectAnswer)
    } else {
      answerEditor.commands.setContent('<p></p>')
    }
  }, [answerEditor, parsedCorrectAnswer])

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
              <div className="tiptap-answer prose prose-sm max-w-none text-emerald-900">
                <EditorContent editor={answerEditor} />
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-emerald-900">{correctAnswer}</p>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .tiptap-answer .ProseMirror {
          outline: none;
          min-height: auto;
          background: transparent;
          padding: 0;
          word-break: break-word;
        }

        .tiptap-answer .ProseMirror p {
          margin: 0.5rem 0;
        }

        .tiptap-answer .ProseMirror h1,
        .tiptap-answer .ProseMirror h2,
        .tiptap-answer .ProseMirror h3 {
          margin: 1rem 0 0.5rem;
          line-height: 1.2;
        }

        .tiptap-answer .ProseMirror h1 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .tiptap-answer .ProseMirror h2 {
          font-size: 1.125rem;
          font-weight: 700;
        }

        .tiptap-answer .ProseMirror h3 {
          font-size: 1rem;
          font-weight: 600;
        }

        .tiptap-answer .ProseMirror ul,
        .tiptap-answer .ProseMirror ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }

        .tiptap-answer .ProseMirror ul {
          list-style-type: disc;
        }

        .tiptap-answer .ProseMirror ol {
          list-style-type: decimal;
        }

        .tiptap-answer .ProseMirror blockquote {
          border-left: 3px solid #6ee7b7;
          margin: 0.75rem 0;
          padding-left: 1rem;
          color: #065f46;
          font-style: italic;
        }

        .tiptap-answer .ProseMirror code {
          background-color: #d1fae5;
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
        }
      `}</style>
    </div>
  )
}
