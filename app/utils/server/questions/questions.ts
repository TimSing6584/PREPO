import "server-only";
import type { Prisma } from "@/lib/generated/prisma/client";
import { QuestionType } from "@/lib/generated/prisma/client";
import { prisma } from "@/app/utils/db";
import { redis } from "@/app/utils/redis";
import {
  DEFAULT_QUESTIONS_TTL_SECONDS,
  defaultQuestionSelect,
  defaultQuestionsByTopicKey,
  fromCachedDefaultQuestion,
  mergeQuestions,
  toCachedDefaultQuestion,
  type CachedDefaultQuestion,
  type QuestionBase,
  type QuestionRecord,
} from "./types";

const activeTopicFilter = { topic: { deleted: false } };

// --- Repository ---

async function fetchDefaultQuestionsFromDb(
  topicId: string
): Promise<QuestionBase[]> {
  return prisma.question.findMany({
    where: {
      topicId,
      type: QuestionType.DEFAULT,
      deleted: false,
      ...activeTopicFilter,
    },
    select: defaultQuestionSelect,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

async function fetchPersonalizedQuestionsFromDb(
  kindeId: string,
  topicId: string
): Promise<QuestionBase[]> {
  return prisma.question.findMany({
    where: {
      topicId,
      type: QuestionType.PERSONALIZED,
      createdById: kindeId,
      deleted: false,
      ...activeTopicFilter,
    },
    select: defaultQuestionSelect,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

async function attachStarredStatus(
  kindeId: string,
  questions: QuestionBase[]
): Promise<QuestionRecord[]> {
  if (questions.length === 0) return [];

  const starred = await prisma.starredQuestion.findMany({
    where: {
      userKindeId: kindeId,
      questionId: { in: questions.map((question) => question.id) },
    },
    select: { questionId: true },
  });

  const starredIds = new Set(starred.map((row) => row.questionId));

  return questions.map((question) => ({
    ...question,
    isStarred: starredIds.has(question.id),
  }));
}

// --- Cache (DEFAULT questions only) ---

export async function getCachedDefaultQuestions(
  topicId: string
): Promise<QuestionBase[] | null> {
  const cached = await redis.get<CachedDefaultQuestion[]>(
    defaultQuestionsByTopicKey(topicId)
  );

  if (!cached || !Array.isArray(cached)) {
    return null;
  }

  return cached.map(fromCachedDefaultQuestion);
}

export async function setCachedDefaultQuestions(
  topicId: string,
  questions: QuestionBase[]
): Promise<void> {
  const payload = questions
    .filter((question) => question.type === "DEFAULT")
    .map((question) =>
      toCachedDefaultQuestion({ ...question, type: "DEFAULT" })
    );

  await redis.set(defaultQuestionsByTopicKey(topicId), payload, {
    ex: DEFAULT_QUESTIONS_TTL_SECONDS,
  });
}

export async function invalidateDefaultQuestionsCache(
  topicId: string
): Promise<void> {
  await redis.del(defaultQuestionsByTopicKey(topicId));
}

/** Write-through: reload DEFAULT questions for a topic from PostgreSQL into Redis. */
export async function refreshDefaultQuestionsCache(
  topicId: string
): Promise<QuestionBase[]> {
  const questions = await fetchDefaultQuestionsFromDb(topicId);
  await setCachedDefaultQuestions(topicId, questions);
  return questions;
}

async function getDefaultQuestions(topicId: string): Promise<QuestionBase[]> {
  const cached = await getCachedDefaultQuestions(topicId);
  if (cached) {
    console.log(`cached default questions found for topic ${topicId}`);
    return cached;
  }

  console.log(`no cached default questions for topic ${topicId}, fetching from database`);
  const fromDb = await fetchDefaultQuestionsFromDb(topicId);
  await setCachedDefaultQuestions(topicId, fromDb);
  return fromDb;
}

// --- Read ---

/**
 * Hybrid fetch: DEFAULT questions from Redis (per topic, 1h TTL),
 * PERSONALIZED questions directly from PostgreSQL. Results are merged
 * and sorted newest-first before returning.
 */
export async function getQuestions(
  kindeId: string,
  topicId: string
): Promise<QuestionRecord[]> {
  const [defaultQuestions, personalizedQuestions] = await Promise.all([
    getDefaultQuestions(topicId),
    fetchPersonalizedQuestionsFromDb(kindeId, topicId),
  ]);

  const merged = mergeQuestions(defaultQuestions, personalizedQuestions);
  return attachStarredStatus(kindeId, merged);
}

// --- Mutations (write-through for DEFAULT) ---

type DefaultQuestionMutationContext = {
  topicId: string;
  type: QuestionType;
};

async function refreshDefaultCacheIfNeeded(
  context: DefaultQuestionMutationContext,
  nextTopicId?: string
): Promise<void> {
  if (context.type !== QuestionType.DEFAULT) return;

  const topicIds = new Set([context.topicId]);
  if (nextTopicId) topicIds.add(nextTopicId);

  await Promise.all(
    [...topicIds].map((topicId) => refreshDefaultQuestionsCache(topicId))
  );
}

export async function createDefaultQuestions(
  data: Prisma.QuestionCreateManyInput[]
): Promise<void> {
  if (data.length === 0) return;

  await prisma.question.createMany({ data });

  const topicIds = [...new Set(data.map((question) => question.topicId))];
  await Promise.all(
    topicIds.map((topicId) => refreshDefaultQuestionsCache(topicId))
  );
}

export async function createPersonalizedQuestion(
  data: Prisma.QuestionCreateManyInput
): Promise<void> {
  await prisma.question.createMany({ data: [data] });
}

export async function updateDefaultQuestion(
  id: string,
  data: Prisma.QuestionUpdateInput,
  context: DefaultQuestionMutationContext
): Promise<QuestionBase> {
  const updated = await prisma.question.update({
    where: { id },
    data,
    select: defaultQuestionSelect,
  });

  await refreshDefaultCacheIfNeeded(context, updated.topicId);
  return updated;
}

export async function updatePersonalizedQuestion(
  id: string,
  data: Prisma.QuestionUpdateInput
): Promise<QuestionBase> {
  return prisma.question.update({
    where: { id },
    data,
    select: defaultQuestionSelect,
  });
}

export async function deleteDefaultQuestion(
  id: string,
  context: DefaultQuestionMutationContext
): Promise<void> {
  await prisma.question.update({
    where: { id },
    data: { deleted: true },
  });

  await refreshDefaultCacheIfNeeded(context);
}

export async function deletePersonalizedQuestion(id: string): Promise<void> {
  await prisma.question.update({
    where: { id },
    data: { deleted: true },
  });
}
