import {
  getPracticeQuestionById,
  getPracticeQuestionIds,
  getTopicPracticeData,
} from '@/app/utils/server/csFundamentals'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import PracticeClient from './PracticeClient'

type PageProps = {
  params: Promise<{ topicId: string }>
  searchParams: Promise<{ page?: string; filter?: string; q?: string }>
}

export default async function PracticePage({ params, searchParams }: PageProps) {
  const { topicId } = await params
  const { page: pageParam, filter: filterParam, q } = await searchParams

  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const filter = filterParam === 'starred' ? 'starred' : 'all'

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const [{ topicName, questions, pagination }, orderedQuestionIds, allQuestionIdsForIndex] = await Promise.all([
    getTopicPracticeData({
      topicId,
      page,
      filter,
    }),
    getPracticeQuestionIds({
      topicId,
      filter,
    }),
    filter === 'all'
      ? Promise.resolve<string[] | null>(null)
      : getPracticeQuestionIds({
          topicId,
          filter: 'all',
        }),
  ])
  const globalOrderedQuestionIds = allQuestionIdsForIndex ?? orderedQuestionIds

  const requestedQuestionId = q?.trim() ? q : undefined
  const questionFromCurrentPage = requestedQuestionId
    ? questions.find((question) => question.id === requestedQuestionId)
    : undefined
  const selectedQuestion =
    questionFromCurrentPage ??
    (requestedQuestionId
      ? await getPracticeQuestionById({
          topicId,
          questionId: requestedQuestionId,
          filter,
        })
      : null) ??
    questions[0] ??
    null

  const initialQuestionId = selectedQuestion?.id ?? ''

  return (
    <PracticeClient
      userId={user?.id ?? 'anon'}
      topicId={topicId}
      topicName={topicName}
      questions={questions}
      orderedQuestionIds={orderedQuestionIds}
      globalOrderedQuestionIds={globalOrderedQuestionIds}
      selectedQuestion={selectedQuestion}
      initialQuestionId={initialQuestionId}
      pagination={pagination}
      filter={filter}
    />
  )
}
