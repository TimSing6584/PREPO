import type { QuestionType } from "@/lib/generated/prisma/client";

// Redis key convention: {app}:{version}:{entity}:{variant}:{scope}:{id...}
const APP_PREFIX = "prepo";
const CACHE_VERSION = "v1";

export const DEFAULT_QUESTIONS_TTL_SECONDS = 60 * 60; // 1 hour

export function defaultQuestionsByTopicKey(topicId: string): string {
  return `${APP_PREFIX}:${CACHE_VERSION}:questions:default:topic:${topicId}`;
}

/** Serializable shape stored in Redis for DEFAULT questions. */
export type CachedDefaultQuestion = {
  id: string;
  createdAt: string;
  updatedAt: string;
  statement: string;
  imageUrl: string | null;
  type: "DEFAULT";
  options: string[];
  correctOption: number;
  correctWritten: string;
  topicId: string;
  createdById: string;
};

export type QuestionBase = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  statement: string;
  imageUrl: string | null;
  type: QuestionType;
  options: string[];
  correctOption: number;
  correctWritten: string;
  topicId: string;
  createdById: string;
};

/** Merged DEFAULT + PERSONALIZED question returned to callers. */
export type QuestionRecord = QuestionBase & {
  isStarred: boolean;
};

export const defaultQuestionSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  statement: true,
  imageUrl: true,
  type: true,
  options: true,
  correctOption: true,
  correctWritten: true,
  topicId: true,
  createdById: true,
} as const;

export function toCachedDefaultQuestion(
  question: QuestionBase & { type: "DEFAULT" }
): CachedDefaultQuestion {
  return {
    ...question,
    type: "DEFAULT",
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  };
}

export function fromCachedDefaultQuestion(
  cached: CachedDefaultQuestion
): QuestionBase {
  return {
    ...cached,
    type: "DEFAULT",
    createdAt: new Date(cached.createdAt),
    updatedAt: new Date(cached.updatedAt),
  };
}

function compareQuestionsNewestFirst(
  a: Pick<QuestionBase, "createdAt" | "id">,
  b: Pick<QuestionBase, "createdAt" | "id">
): number {
  const byDate = b.createdAt.getTime() - a.createdAt.getTime();
  if (byDate !== 0) return byDate;
  return b.id.localeCompare(a.id);
}

export function mergeQuestions(
  defaultQuestions: QuestionBase[],
  personalizedQuestions: QuestionBase[]
): QuestionBase[] {
  return [...defaultQuestions, ...personalizedQuestions].sort(
    compareQuestionsNewestFirst
  );
}
