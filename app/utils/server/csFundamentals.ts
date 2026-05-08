import "server-only";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { QuestionType } from "@/lib/generated/prisma/client";
import { prisma } from "@/app/utils/db";
import type { PracticeQuestion } from "@/components/cs-fundamentals/practice/types";

export type TopicPracticeData = {
  topicName: string;
  questions: PracticeQuestion[];
};

export async function getTopicPracticeData(topicId: string): Promise<TopicPracticeData> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userKindeId = user?.id ?? "";

  const topic = await prisma.topic.findFirst({
    where: { id: topicId, deleted: false },
    select: { name: true },
  });

  const questions = await prisma.question.findMany({
    where: {
      topicId,
      deleted: false,
      topic: { deleted: false },
      OR: [
        { type: QuestionType.DEFAULT },
        {
          type: QuestionType.PERSONALIZED,
          createdById: userKindeId,
        },
      ],
    },
    select: {
      id: true,
      statement: true,
      imageUrl: true,
      options: true,
      correctOption: true,
      correctWritten: true,
      createdAt: true,
      starredBy: {
        where: {
          userKindeId,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return {
    topicName: topic?.name ?? topicId,
    questions: questions.map((question) => ({
      id: question.id,
      text: question.statement,
      imageUrl: question.imageUrl,
      options: question.options,
      correctOption: question.correctOption,
      correctWritten: question.correctWritten,
      isStarred: question.starredBy.length > 0,
    })),
  };
}

