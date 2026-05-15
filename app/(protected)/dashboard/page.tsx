import { prisma } from '@/app/utils/db'
import DashboardClient from '@/components/dashboard/DashboardClient'
import type { Topic } from '@/app/utils/api/topics'
import { redis } from '@/app/utils/redis'
export const revalidate = 60

async function getTopics(): Promise<Topic[]> {
  const cachedTopics = await redis.get<Topic[]>('topics')
  if (cachedTopics) {
    console.log("cached topics found, returning from cache")
    return cachedTopics
  }
  console.log("no cached topics found, fetching from database")
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
  const topicsReturned = topics.map((topic) => ({
    ...topic,
    createdAt: topic.createdAt.toISOString(),
  }))
  await redis.set('topics', JSON.stringify(topicsReturned));
  return topicsReturned
}

export default async function DashboardPage() {
  const topics = await getTopics()
  return <DashboardClient topics={topics} />
}
