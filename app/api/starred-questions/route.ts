import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { prisma } from '@/app/utils/db'
import { checkRateLimit } from '@/app/utils/ratelimit'

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const rateLimitError = await checkRateLimit('write')
    if (rateLimitError) return rateLimitError

    const body = (await request.json()) as { questionId?: string; starred?: boolean }
    const questionId = body.questionId
    const starred = body.starred

    if (!questionId || typeof starred !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        deleted: false,
        topic: { deleted: false },
      },
      select: { id: true },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found.' }, { status: 404 })
    }

    if (starred) {
      await prisma.starredQuestion.upsert({
        where: {
          questionId_userKindeId: {
            questionId,
            userKindeId: user.id,
          },
        },
        update: {},
        create: {
          questionId,
          userKindeId: user.id,
        },
      })
    } else {
      await prisma.starredQuestion.deleteMany({
        where: {
          questionId,
          userKindeId: user.id,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
