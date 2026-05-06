import { getTopicPracticeData } from '@/app/utils/server/csFundamentals'
import PracticeClient from './PracticeClient'

type PageProps = {
  params: Promise<{ topicId: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function PracticePage({ params, searchParams }: PageProps) {
  const { topicId } = await params
  const { q } = await searchParams
  const { topicName, questions } = await getTopicPracticeData(topicId)

  const initialQuestionId =
    q && questions.some((question) => question.id === q) ? q : (questions[0]?.id ?? '')

  return (
    <PracticeClient
      topicId={topicId}
      topicName={topicName}
      questions={questions}
      initialQuestionId={initialQuestionId}
    />
  )
}

