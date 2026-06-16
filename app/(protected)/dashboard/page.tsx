import { prisma } from '@/app/utils/db'
import DashboardClient from '@/components/dashboard/DashboardClient'
import type { Topic } from '@/app/utils/api/topics'
import { redis } from '@/app/utils/redis'
import { enforceRateLimit } from '@/app/utils/ratelimit'

export const dynamic = 'force-dynamic'

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
  await redis.expire('topics', 604800); // Set expiration to 7 days (in seconds)
  return topicsReturned
}

export default async function DashboardPage() {
  await enforceRateLimit('read')
  const topics = await getTopics()
  return <DashboardClient topics={topics} />
}
