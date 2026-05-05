import { prisma } from '@/app/utils/db'
import DashboardClient from '@/components/dashboard/DashboardClient'
import type { Topic } from '@/app/utils/api/topics'

export const revalidate = 60

async function getTopics(): Promise<Topic[]> {
  const topics = await prisma.topic.findMany({
    where: {
      deleted: false,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return topics.map((topic) => ({
    ...topic,
    createdAt: topic.createdAt.toISOString(),
  }))
}

export default async function DashboardPage() {
  const topics = await getTopics()
  return <DashboardClient topics={topics} />
}
