type QuestionType = 'DEFAULT' | 'PERSONALIZED';

export type QuestionRow = {
  id: string;
  createdAt: string;
  statement: string;
  imageUrl: string | null;
  type: QuestionType;
  topic: {
    id: string;
    name: string;
  };
  createdBy: {
    name: string | null;
    email: string;
  };
};

type QuestionsApiResponse = {
  success?: boolean;
  data?: QuestionRow[];
  error?: string;
};

export async function fetchQuestions(signal?: AbortSignal): Promise<QuestionRow[]> {
  const response = await fetch('/api/questions', {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const result: QuestionsApiResponse = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}
