export type Topic = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  _count?: {
    questions: number;
  };
};

type TopicsApiResponse = {
  success?: boolean;
  data?: Topic[];
  error?: string;
};

export async function fetchTopics(signal?: AbortSignal): Promise<Topic[]> {
  const response = await fetch('/api/topics', { signal });

  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }

  const result: TopicsApiResponse = await response.json();
  return Array.isArray(result.data) ? result.data : [];
}
