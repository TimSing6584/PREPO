import { getTopicPracticeData } from '@/app/utils/server/csFundamentals'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import PracticeClient from './PracticeClient'

type PageProps = {
  params: Promise<{ topicId: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function PracticePage({ params, searchParams }: PageProps) {
  const { topicId } = await params
  const { q } = await searchParams
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const { topicName, questions } = await getTopicPracticeData(topicId)

  const initialQuestionId =
    q && questions.some((question) => question.id === q) ? q : (questions[0]?.id ?? '')

  return (
    <PracticeClient
      userId={user?.id ?? 'anon'}
      topicId={topicId}
      topicName={topicName}
      questions={questions}
      initialQuestionId={initialQuestionId}
    />
  )
}

