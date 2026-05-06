'use client'

import { useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import TipTapEditor from '@/components/TipTap/TipTapEditor'

interface WrittenViewProps {
  correctAnswer: string
}

type EditorContent = NonNullable<ComponentProps<typeof TipTapEditor>['initialContent']>
type RichNode = {
  type?: string
  text?: string
  marks?: Array<{ type?: string }>
  content?: RichNode[]
  attrs?: { level?: number }
}

const hasRichTextShape = (value: unknown): value is Exclude<EditorContent, string> => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as { type?: unknown }
  return candidate.type === 'doc'
}

const renderNodes = (nodes: RichNode[] = [], keyPrefix = 'node'): ReactNode[] =>
  nodes.map((node, index) => renderNode(node, `${keyPrefix}-${index}`))

const applyMarks = (content: ReactNode, marks?: Array<{ type?: string }>, key = 'mark') => {
  if (!marks?.length) return content

  return marks.reduce<ReactNode>((acc, mark, index) => {
    const markKey = `${key}-${index}`
    switch (mark.type) {
      case 'bold':
        return <strong key={markKey}>{acc}</strong>
      case 'italic':
        return <em key={markKey}>{acc}</em>
      case 'strike':
        return <s key={markKey}>{acc}</s>
      case 'code':
        return <code key={markKey}>{acc}</code>
      default:
        return acc
    }
  }, content)
}

const renderNode = (node: RichNode, key: string): ReactNode => {
  if (node.type === 'text') {
    return <span key={key}>{applyMarks(node.text ?? '', node.marks, key)}</span>
  }

  const children = renderNodes(node.content, key)

  switch (node.type) {
    case 'paragraph':
      return <p key={key} className="mb-2 last:mb-0">{children}</p>
    case 'heading': {
      const level = node.attrs?.level ?? 3
      if (level === 1) return <h1 key={key} className="mb-2 text-xl font-bold">{children}</h1>
      if (level === 2) return <h2 key={key} className="mb-2 text-lg font-bold">{children}</h2>
      return <h3 key={key} className="mb-2 text-base font-semibold">{children}</h3>
    }
    case 'bulletList':
      return <ul key={key} className="mb-2 list-disc pl-5">{children}</ul>
    case 'orderedList':
      return <ol key={key} className="mb-2 list-decimal pl-5">{children}</ol>
    case 'listItem':
      return <li key={key} className="mb-1">{children}</li>
    case 'blockquote':
      return <blockquote key={key} className="mb-2 border-l-2 border-emerald-300 pl-3 italic">{children}</blockquote>
    case 'hardBreak':
      return <br key={key} />
    default:
      return <span key={key}>{children}</span>
  }
}

const renderFormattedAnswer = (answer: string): ReactNode => {
  try {
    const parsed = JSON.parse(answer) as unknown
    if (hasRichTextShape(parsed)) {
      return <div>{renderNode(parsed as RichNode, 'doc-root')}</div>
    }
  } catch {
    // fallback below
  }

  return <p className="whitespace-pre-wrap">{answer}</p>
}

export default function WrittenView({
  correctAnswer
}: WrittenViewProps) {
  const [answer, setAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const formattedAnswer = renderFormattedAnswer(correctAnswer)

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
            <div className="prose prose-sm max-w-none text-emerald-900">{formattedAnswer}</div>
          </div>
        )}
      </div>
    </div>
  )
}
