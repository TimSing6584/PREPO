import Navbar from '@/components/main/Navbar'
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import { getPracticeQuestionIds, getTopicPracticeData } from '@/app/utils/server/csFundamentals'
import type { QuestionFilter } from '@/app/utils/server/csFundamentals'

type PageProps = {
  params: Promise<{ topicId: string }>
  searchParams: Promise<{ page?: string; filter?: string }>
}

export default async function TopicPage({ params, searchParams }: PageProps) {
  const { topicId } = await params
  const { page: pageParam, filter: filterParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const filter: QuestionFilter = filterParam === 'starred' ? 'starred' : 'all'

  const [{ topicName, questions, pagination }, allQuestionIdsForIndex] = await Promise.all([
    getTopicPracticeData({ topicId, page, filter }),
    filter === 'all'
      ? Promise.resolve<string[] | null>(null)
      : getPracticeQuestionIds({
          topicId,
          filter: 'all',
        }),
  ])

  const globalNumberById = allQuestionIdsForIndex
    ? Object.fromEntries(allQuestionIdsForIndex.map((id, index) => [id, index + 1]))
    : null

  const { totalCount, totalPages } = pagination
  const nextFilter: QuestionFilter = filter === 'all' ? 'starred' : 'all'
  const filterToggleHref = `/cs-fundamentals/${topicId}?page=1&filter=${nextFilter}`

  return (
    <div className="main-frame px-4 sm:px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-3 sm:gap-4 md:gap-6 font-geist-sans">
      <Navbar />

      <div className="flex-1 -mx-4 sm:-mx-6 md:-mx-12 -mb-6 md:-mb-12">
        <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8 pb-16 sm:pb-20">

            {/* Header nav */}
            <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row sm:items-center sm:justify-between px-1 sm:px-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to Dashboard
              </Link>
              <div className="text-xs font-medium text-neutral-400 flex items-center gap-2 min-w-0">
                <span className="shrink-0">Topic:</span>
                <span className="text-neutral-900 uppercase tracking-wider font-bold truncate">
                  {topicName}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-neutral-100 shadow-sm p-4 sm:p-6 md:p-10">
              <div className="flex flex-col gap-4 sm:gap-5 mb-4 sm:mb-6">
                <div className="space-y-1 sm:space-y-2 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101010]">
                    Choose a question
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500">
                    Pick one to open the question card.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
                    <Link
                      href={`/personalized-questions/create?topicId=${encodeURIComponent(topicId)}`}
                      className="inline-flex w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-full border border-primary-200 bg-primary-50 px-4 py-2.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                    >
                      + Create my question
                    </Link>
                    <Link
                      href={filterToggleHref}
                      className={`inline-flex w-full sm:w-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-4 py-2.5 sm:px-3 sm:py-1.5 text-xs font-semibold transition-colors ${
                        filter === 'starred'
                          ? 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      {filter === 'all' && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-500 text-amber-500" />}
                      {filter === 'all' ? 'All Starred' : 'All questions'}
                    </Link>
                  </div>
                  <div className="text-xs font-semibold text-neutral-400">
                    Total {totalCount} questions
                  </div>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
                  No questions found for this topic.
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {questions.map((q, index) => {
                    const globalIndex =
                      globalNumberById?.[q.id] ??
                      (pagination.page - 1) * pagination.pageSize + index + 1
                    return (
                      <Link
                        key={q.id}
                        href={`/cs-fundamentals/${topicId}/practice?page=${pagination.page}&filter=${filter}&q=${encodeURIComponent(q.id)}`}
                        className="w-full text-left px-3 py-3 sm:px-4 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-between gap-2 sm:gap-4 group border bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 min-h-[4.5rem] sm:min-h-[72px]"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0 overflow-hidden">
                          <div className="shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 transition-colors">
                            {globalIndex}
                          </div>
                          <div className="flex flex-col min-w-0 overflow-hidden">
                            <span className="text-sm md:text-base font-semibold truncate text-neutral-900">
                              {q.text}
                            </span>
                            <span className="text-[11px] sm:text-xs text-neutral-400 truncate">
                              Multiple choice + Written
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                          {q.isStarred && (
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          )}
                          <div className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-700 transition-colors">
                            Open
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-1">
                <Link
                  href={`/cs-fundamentals/${topicId}?page=${pagination.page - 1}&filter=${filter}`}
                  aria-disabled={pagination.page <= 1}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 sm:px-4 text-sm font-semibold transition-colors ${
                    pagination.page <= 1
                      ? 'pointer-events-none border-neutral-100 text-neutral-300'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Link>

                <span className="text-xs sm:text-sm font-semibold text-neutral-500 tabular-nums">
                  Page {pagination.page} / {totalPages}
                </span>

                <Link
                  href={`/cs-fundamentals/${topicId}?page=${pagination.page + 1}&filter=${filter}`}
                  aria-disabled={pagination.page >= totalPages}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 sm:px-4 text-sm font-semibold transition-colors ${
                    pagination.page >= totalPages
                      ? 'pointer-events-none border-neutral-100 text-neutral-300'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}