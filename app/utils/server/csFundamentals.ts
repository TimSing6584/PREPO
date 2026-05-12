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

function toPracticeQuestion(
  question: {
    id: string;
    statement: string;
    imageUrl: string | null;
    options: string[];
    correctOption: number | null;
    correctWritten: string | null;
    starredBy: { id: string }[];
  }
): PracticeQuestion {
  return {
    id: question.id,
    text: question.statement,
    imageUrl: question.imageUrl,
    options: question.options,
    correctOption: question.correctOption ?? -1,
    correctWritten: question.correctWritten ?? "",
    isStarred: question.starredBy.length > 0,
  };
}


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
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
    questions: questions.map(toPracticeQuestion),
  };
}

type GetPracticeQuestionByIdOptions = {
  topicId: string;
  questionId: string;
  filter?: QuestionFilter;
};

export async function getPracticeQuestionById({
  topicId,
  questionId,
  filter = "all",
}: GetPracticeQuestionByIdOptions): Promise<PracticeQuestion | null> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userKindeId = user?.id ?? "";

  const question = await prisma.question.findFirst({
    where: {
      ...buildWhereClause(topicId, userKindeId, filter),
      id: questionId,
    },
    select: {
      id: true,
      statement: true,
      imageUrl: true,
      options: true,
      correctOption: true,
      correctWritten: true,
      starredBy: { where: { userKindeId }, select: { id: true } },
    },
  });

  return question ? toPracticeQuestion(question) : null;
}

type GetPracticeQuestionIdsOptions = {
  topicId: string;
  filter?: QuestionFilter;
};

export async function getPracticeQuestionIds({
  topicId,
  filter = "all",
}: GetPracticeQuestionIdsOptions): Promise<string[]> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userKindeId = user?.id ?? "";

  const questions = await prisma.question.findMany({
    where: buildWhereClause(topicId, userKindeId, filter),
    select: { id: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return questions.map((question) => question.id);
}
