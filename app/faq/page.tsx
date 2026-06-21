'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const faqs: { question: string; answer: string }[] = [
    {
        question: 'What is Prepo?',
        answer:
            'Prepo is a platform for revising computer science fundamentals and practicing technical interview questions. You can work through curated practice questions across topics like Operating Systems, Computer Networks, Databases, OOP, and DSA, or create your own personalized questions.',
    },
    {
        question: 'What question formats are available?',
        answer:
            'Each question can be answered in two formats: Multiple Choice Question (best for fast practice before an interview) and Open-ended Quiz (best for practicing memory and explanation). Open-ended answers can also be submitted by speaking your response, which is transcribed and scored by AI.',
    },
    {
        question: 'How does the speech-based answer evaluation work?',
        answer:
            'When you speak your answer instead of typing it, your recording is transcribed using a third-party speech-to-text service and then evaluated by an AI model against a model answer. You receive a score and feedback on what you got right and what you may have missed.',
    },
    {
        question: 'Is the AI feedback always accurate?',
        answer:
            'AI-generated scores and feedback are intended as a practice and self-assessment tool, not a guarantee of how you would perform in a real interview or exam. The underlying models can occasionally make mistakes, so use the feedback as guidance rather than a definitive judgment of your knowledge.',
    },
    {
        question: 'Can I create my own questions?',
        answer:
            'Yes. In addition to the default curated questions created by admins, you can create your own personalized questions if you feel the existing set isn\u2019t enough for a topic you\u2019re studying.',
    },
    {
        question: 'Do I need an account to use Prepo?',
        answer:
            'Yes, an account is required to save your progress, open-ended answers, and practice history. Authentication is handled securely through our sign-in provider.',
    },
    {
        question: 'Is my voice recording stored or used to train AI models?',
        answer:
            'No, we do not use your voice recordings to train AI models. Recordings are sent to a third-party speech-to-text provider for transcription as part of generating your score and feedback. See our Privacy Policy for full details on data handling.',
    },
    {
        question: 'Is Prepo free to use?',
        answer:
            'Prepo is currently free to use while in development. If pricing changes in the future, we will communicate this clearly before any changes take effect.',
    },
    {
        question: 'How do I report a bug or give feedback?',
        answer:
            'You can reach out to us directly by email and we\u2019ll get back to you as soon as we can.',
    },
    {
        question: 'How do I delete my account or data?',
        answer:
            'You can request deletion of your account and associated data at any time by contacting us. See our Privacy Policy for more on data retention and your rights.',
    },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border-b border-gray-100 py-6">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between text-left"
                aria-expanded={open}
            >
                <span className="text-base font-medium text-[#101010] pr-4">{question}</span>
                <span
                    className={`shrink-0 text-xl text-gray-400 transition-transform duration-200 ${open ? 'rotate-45' : ''
                        }`}
                >
                    +
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-200 ${open ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="text-gray-600 leading-relaxed">{answer}</p>
            </div>
        </div>
    )
}

export default function FaqPage() {
    return (
        <div className="main-frame min-h-screen bg-white">
            {/* Minimal nav */}
            <header className="px-8 py-6 border-b border-gray-100">
                <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                    <Image
                        src="/prepo-logo/prepo-logo.svg"
                        alt="Prepo Logo"
                        width={120}
                        height={40}
                        className="h-10 w-auto"
                    />
                </Link>
            </header>

            <main className="max-w-3xl mx-auto px-8 py-16">
                <h1 className="text-4xl font-bold text-[#101010] mb-2">Frequently Asked Questions</h1>
                <p className="text-sm text-gray-400 mb-12">
                    Answers to common questions about using Prepo.
                </p>

                <div>
                    {faqs.map((faq) => (
                        <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                    ))}
                </div>

                <p className="mt-12 text-gray-600 leading-relaxed">
                    Can&apos;t find what you&apos;re looking for? Reach out at{' '}
                    <a
                        href="mailto:prepo.dev.contact@gmail.com"
                        className="text-[#101010] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                        prepo.dev.contact@gmail.com
                    </a>
                    .
                </p>
            </main>

            {/* Footer */}
            <footer className="max-w-3xl mx-auto px-8 py-12 mt-8 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} Prepo Platform.</p>
                    <Link href="/" className="hover:text-[#101010] transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </footer>
        </div>
    )
}