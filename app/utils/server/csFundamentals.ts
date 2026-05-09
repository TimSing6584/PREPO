import "server-only";
import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { QuestionType } from "@/lib/generated/prisma/client";
import { prisma } from "@/app/utils/db";
import type { PracticeQuestion } from "@/components/cs-fundamentals/practice/types";

// Constants

export const PAGE_SIZE = 10;

// Types

export type QuestionFilter = "all" | "starred";

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type TopicPracticeData = {
  topicName: string;
  questions: PracticeQuestion[];
  pagination: PaginationMeta;
};


// Shared where-clause builder

function buildWhereClause(
  topicId: string,
  userKindeId: string,
  filter: QuestionFilter
) {
  return {
    topicId,
    deleted: false,
    topic: { deleted: false },
    OR: [
      { type: QuestionType.DEFAULT },
      { type: QuestionType.PERSONALIZED, createdById: userKindeId },
    ],
    ...(filter === "starred" ? { starredBy: { some: { userKindeId } } } : {}),
  };
}

// Practice page data (sidebar + question card)

type GetPracticeDataOptions = {
  topicId: string;
  page?: number;
  filter?: QuestionFilter;
};

export async function getTopicPracticeData({
  topicId,
  page = 1,
  filter = "all",
}: GetPracticeDataOptions): Promise<TopicPracticeData> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userKindeId = user?.id ?? "";

  const where = buildWhereClause(topicId, userKindeId, filter);

  const [topic, totalCount, questions] = await Promise.all([
    prisma.topic.findFirst({
      where: { id: topicId, deleted: false },
      select: { name: true },
    }),
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      select: {
        id: true,
        statement: true,
        imageUrl: true,
        options: true,
        correctOption: true,
        correctWritten: true,
        createdAt: true,
        starredBy: { where: { userKindeId }, select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  // If the topic doesn't exist or is deleted, show 404
  if (!topic) notFound();

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return {
    topicName: topic?.name ?? topicId,
    pagination: { page: safePage, pageSize: PAGE_SIZE, totalCount, totalPages },
    questions: questions.map((q) => ({
      id: q.id,
      text: q.statement,
      imageUrl: q.imageUrl,
      options: q.options,
      correctOption: q.correctOption,
      correctWritten: q.correctWritten,
      isStarred: q.starredBy.length > 0,
    })),
  };
}

