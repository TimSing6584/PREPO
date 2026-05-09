import { getTopicPracticeData, PAGE_SIZE } from '@/app/utils/server/csFundamentals'
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

  const { topicName, questions, pagination } = await getTopicPracticeData({
    topicId,
    page,
    filter,
  })

  // If a specific ?q= was requested and it exists on this page, start there.
  // Otherwise default to the first question on the page.
  const initialQuestionId =
    q && questions.some((question) => question.id === q)
      ? q
      : (questions[0]?.id ?? '')

  return (
    <PracticeClient
      userId={user?.id ?? 'anon'}
      topicId={topicId}
      topicName={topicName}
      questions={questions}
      initialQuestionId={initialQuestionId}
      pagination={pagination}
      filter={filter}
    />
  )
}
