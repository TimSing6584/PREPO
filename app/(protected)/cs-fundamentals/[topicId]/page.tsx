import Navbar from '@/components/main/Navbar'
import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { getTopicPracticeData } from '@/app/utils/server/csFundamentals'

export default async function PracticePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params
  const { topicName, questions } = await getTopicPracticeData(topicId)
  const starredCount = questions.filter((question) => question.isStarred).length

  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-4 md:gap-6 font-geist-sans">
      <Navbar />

      <div className="flex-1 -mx-6 md:-mx-12 -mb-6 md:-mb-12">
        <div className="h-full overflow-y-auto p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header info */}
            <div className="flex items-center justify-between px-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to Dashboard
              </Link>

              <div className="text-xs font-medium text-neutral-400 flex items-center gap-2">
                Topic:{' '}
                <span className="text-neutral-900 uppercase tracking-wider font-bold">{topicName}</span>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-6 md:p-10">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#101010]">Choose a question</h1>
                  <p className="text-sm text-neutral-500">
                    Pick one to open the question card.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/personalized-questions/create?topicId=${encodeURIComponent(topicId)}`}
                    className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    + Create my question
                  </Link>
                  <div className="text-xs font-semibold text-neutral-400">
                    {questions.length} questions{starredCount > 0 ? ` • ${starredCount} starred` : ''}
                  </div>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
                  No questions found for this topic.
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, index) => (
                    <Link
                      key={q.id}
                      href={`/cs-fundamentals/${topicId}/practice?q=${encodeURIComponent(q.id)}`}
                      className="w-full text-left px-4 py-4 rounded-2xl transition-all duration-200 flex items-center justify-between group border bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 min-h-[72px]"
                    >
                      <div className="flex items-center gap-4 flex-1 overflow-hidden">
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm md:text-base font-semibold truncate text-neutral-900">
                            {q.text}
                          </span>
                          <span className="text-xs text-neutral-400">
                            Multiple choice + Written
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {q.isStarred ? (
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ) : null}
                        <div className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-700 transition-colors">
                          Open
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
