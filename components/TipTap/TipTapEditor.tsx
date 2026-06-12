'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import {
  Bold,
  ChevronDown,
  Italic,
  List,
  ListOrdered,
  Minus,
  MoreHorizontal,
  Pilcrow,
  Quote,
  Link2,
  Redo2,
  Undo2,
} from 'lucide-react'

type TiptapJSON = ReturnType<Editor['getJSON']>

interface TiptapEditorProps {
  initialContent?: string | TiptapJSON
  placeholder?: string
  onChange?: (content: TiptapJSON) => void
  showToolbar?: boolean
  editable?: boolean
  editorClassName?: string
  containerClassName?: string
}

function ToolbarButton({
  editor,
  onClick,
  active = false,
  label,
  children,
  className = '',
}: {
  editor: Editor | null
  onClick: () => void
  active?: boolean
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={!editor}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-xs transition sm:h-9 sm:w-9 sm:text-sm ${
        active
          ? 'border-zinc-400 bg-zinc-200 text-zinc-900'
          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
      } disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:opacity-70 ${className}`}
    >
      {children}
    </button>
  )
}

function HeadingSelect({
  editor,
  headingLevel,
  className = '',
}: {
  editor: Editor | null
  headingLevel?: number
  className?: string
}) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <select
        className="h-8 w-full min-w-0 appearance-none rounded-md border border-zinc-300 bg-white py-1 pl-2 pr-6 text-xs text-zinc-700 outline-none sm:h-9 sm:text-sm"
        value={headingLevel ?? 0}
        onChange={(event) => {
          const value = Number(event.target.value)
          if (!editor) return
          if (value === 0) {
            editor.chain().focus().setParagraph().run()
            return
          }
          editor.chain().focus().toggleHeading({ level: value as 1 | 2 | 3 | 4 | 5 | 6 }).run()
        }}
      >
        <option value={0}>Paragraph</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
        <option value={4}>Heading 4</option>
        <option value={5}>Heading 5</option>
        <option value={6}>Heading 6</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500 sm:right-1.5 sm:h-4 sm:w-4" />
    </div>
  )
}

function insertLink(editor: Editor | null) {
  if (!editor) return

  if (editor.isActive('link')) {
    editor.chain().focus().unsetLink().run()
    return
  }

  const url = window.prompt('Enter URL')
  if (!url?.trim()) return

  const { from, to } = editor.state.selection
  const hasSelection = from !== to

  if (hasSelection) {
    editor.chain().focus().setLink({ href: url.trim() }).run()
  } else {
    editor
      .chain()
      .focus()
      .insertContent(`<a href="${url.trim()}">${url.trim()}</a>`)
      .run()
  }
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  const headingLevel = [1, 2, 3, 4, 5, 6].find((level) =>
    editor?.isActive('heading', { level }),
  )

  useEffect(() => {
    if (!moreOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [moreOpen])

  const moreMenuItems = [
    {
      label: 'Bullet list',
      icon: List,
      active: !!editor?.isActive('bulletList'),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Ordered list',
      icon: ListOrdered,
      active: !!editor?.isActive('orderedList'),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      label: 'Blockquote',
      icon: Quote,
      active: !!editor?.isActive('blockquote'),
      onClick: () => editor?.chain().focus().toggleBlockquote().run(),
    },
    {
      label: 'Horizontal rule',
      icon: Minus,
      active: false,
      onClick: () => editor?.chain().focus().setHorizontalRule().run(),
    },
    {
      label: 'Paragraph',
      icon: Pilcrow,
      active: !!editor?.isActive('paragraph'),
      onClick: () => editor?.chain().focus().setParagraph().run(),
    },
    {
      label: 'Insert URL',
      icon: Link2,
      active: !!editor?.isActive('link'),
      onClick: () => insertLink(editor),
    },
  ]

  return (
    <div className="border-b border-zinc-300 bg-zinc-100 p-1.5 sm:p-2">
      {/* Mobile: compact toolbar + overflow menu */}
      <div className="flex sm:hidden items-center gap-1">
        <ToolbarButton editor={editor} label="Undo" onClick={() => editor?.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton editor={editor} label="Redo" onClick={() => editor?.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <HeadingSelect editor={editor} headingLevel={headingLevel} className="min-w-[5.5rem] flex-1" />

        <ToolbarButton
          editor={editor}
          label="Bold"
          active={!!editor?.isActive('bold')}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label="Italic"
          active={!!editor?.isActive('italic')}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <div className="relative shrink-0" ref={moreMenuRef}>
          <button
            type="button"
            aria-label="More formatting options"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((open) => !open)}
            disabled={!editor}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs transition ${
              moreOpen
                ? 'border-zinc-400 bg-zinc-200 text-zinc-900'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {moreOpen ? (
            <div className="absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
              {moreMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.onClick()
                      setMoreOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-zinc-50 ${
                      item.active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop: full toolbar */}
      <div className="hidden sm:flex flex-wrap items-center gap-1">
        <ToolbarButton editor={editor} label="Undo" onClick={() => editor?.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton editor={editor} label="Redo" onClick={() => editor?.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-zinc-300" />

        <HeadingSelect editor={editor} headingLevel={headingLevel} className="w-auto" />

        <ToolbarButton
          editor={editor}
          label="Bold"
          active={!!editor?.isActive('bold')}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label="Italic"
          active={!!editor?.isActive('italic')}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-zinc-300" />

        <ToolbarButton
          editor={editor}
          label="Bullet list"
          active={!!editor?.isActive('bulletList')}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label="Ordered list"
          active={!!editor?.isActive('orderedList')}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label="Blockquote"
          active={!!editor?.isActive('blockquote')}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label="Horizontal rule"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          label="Paragraph"
          active={!!editor?.isActive('paragraph')}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-zinc-300" />

        <ToolbarButton
          editor={editor}
          label="Insert URL"
          active={!!editor?.isActive('link')}
          onClick={() => insertLink(editor)}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  )
}

export default function TipTapEditor({
  initialContent = '<p>Start typing...</p>',
  onChange,
  showToolbar = true,
  editable = true,
  editorClassName = 'min-h-[220px] bg-white p-3 text-zinc-900 sm:min-h-[280px] sm:p-4 lg:min-h-[320px] lg:p-5',
  containerClassName = 'w-full max-w-full overflow-hidden rounded-xl border border-zinc-300 bg-zinc-50',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
        },
      }),
    ],
    content: initialContent,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  return (
    <div className={`tiptap-editor ${containerClassName}`}>
      {showToolbar && editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className={editorClassName} />

      <style jsx global>{`
        .tiptap-editor .ProseMirror {
          outline: none;
          word-break: break-word;
        }

        .tiptap-editor .ProseMirror p {
          margin: 0.5rem 0;
        }

        .tiptap-editor .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          line-height: 1.2;
        }

        .tiptap-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
          line-height: 1.2;
        }

        .tiptap-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          line-height: 1.2;
        }

        .tiptap-editor .ProseMirror h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          line-height: 1.2;
        }

        .tiptap-editor .ProseMirror h5,
        .tiptap-editor .ProseMirror h6 {
          font-size: 1rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          line-height: 1.2;
        }

        .tiptap-editor .ProseMirror ul,
        .tiptap-editor .ProseMirror ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }

        .tiptap-editor .ProseMirror ul {
          list-style-type: disc;
        }

        .tiptap-editor .ProseMirror ol {
          list-style-type: decimal;
        }

        .tiptap-editor .ProseMirror ul li,
        .tiptap-editor .ProseMirror ol li {
          margin: 0.25rem 0;
        }

        .tiptap-editor .ProseMirror blockquote {
          border-left: 3px solid #d4d4d8;
          margin: 0.75rem 0;
          padding-left: 1rem;
          color: #71717a;
          font-style: italic;
        }

        .tiptap-editor .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }

        .tiptap-editor .ProseMirror a:hover {
          color: #1e40af;
        }

        @media (max-width: 640px) {
          .tiptap-editor .ProseMirror {
            font-size: 0.95rem;
            line-height: 1.5;
          }

          .tiptap-editor .ProseMirror h1 {
            font-size: 1.6rem;
          }

          .tiptap-editor .ProseMirror h2 {
            font-size: 1.35rem;
          }

          .tiptap-editor .ProseMirror h3 {
            font-size: 1.15rem;
          }

          .tiptap-editor .ProseMirror ul,
          .tiptap-editor .ProseMirror ol {
            padding-left: 1.25rem;
          }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
          .tiptap-editor .ProseMirror {
            font-size: 1rem;
            line-height: 1.65;
          }
        }

        @media (min-width: 1024px) {
          .tiptap-editor .ProseMirror {
            font-size: 1.05rem;
            line-height: 1.75;
          }
        }
      `}</style>
    </div>
  )
}
