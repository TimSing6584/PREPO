import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/app/utils/db";
import { getQuestions } from "@/app/utils/server/questions";
import type { QuestionRecord } from "@/app/utils/server/questions";
import type { PracticeQuestion } from "@/components/cs-fundamentals/practice/types";
import { nameToSlug } from "@/app/utils/topicSlug";

export async function getTopicByName(topicName: string): Promise<{ id: string; name: string }> {
  const topics = await prisma.topic.findMany({
    where: { deleted: false },
    select: { id: true, name: true },
  });
  const topic = topics.find((t) => nameToSlug(t.name) === topicName);
  if (!topic) notFound();
  return topic;
}

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

const getQuestionsForTopic = cache(getQuestions);

function toPracticeQuestion(question: QuestionRecord): PracticeQuestion {
  return {
    id: question.id,
    text: question.statement,
    imageUrl: question.imageUrl,
    options: question.options,
    correctOption: question.correctOption ?? -1,
    correctWritten: question.correctWritten ?? "",
    isStarred: question.isStarred,
  };
}

function applyFilter(
  questions: QuestionRecord[],
  filter: QuestionFilter
): QuestionRecord[] {
  if (filter === "starred") {
    return questions.filter((question) => question.isStarred);
  }
  return questions;
}

async function getUserKindeId(): Promise<string> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return user?.id ?? "";
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
  const userKindeId = await getUserKindeId();

  const [topic, allQuestions] = await Promise.all([
    prisma.topic.findFirst({
      where: { id: topicId, deleted: false },
      select: { name: true },
    }),
    getQuestionsForTopic(userKindeId, topicId),
  ]);

  if (!topic) notFound();

  const filtered = applyFilter(allQuestions, filter);
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageQuestions = filtered
    .slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    .map(toPracticeQuestion);

  return {
    topicName: topic.name,
    pagination: { page: safePage, pageSize: PAGE_SIZE, totalCount, totalPages },
    questions: pageQuestions,
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
  const userKindeId = await getUserKindeId();
  const filtered = applyFilter(
    await getQuestionsForTopic(userKindeId, topicId),
    filter
  );
  const question = filtered.find((item) => item.id === questionId);

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
  const userKindeId = await getUserKindeId();
  const filtered = applyFilter(
    await getQuestionsForTopic(userKindeId, topicId),
    filter
  );

  return filtered.map((question) => question.id);
}
