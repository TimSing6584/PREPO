'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type PersonalizedQuestionItem = {
  id: string;
  createdAt: string;
  statement: string;
  imageUrl: string | null;
  topic: {
    name: string;
  };
};

export default function PersonalizedQuestionsClient({
  initialQuestions,
}: {
  initialQuestions: PersonalizedQuestionItem[];
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState<PersonalizedQuestionItem[]>(initialQuestions);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const sortedQuestions = useMemo(
    () =>
      [...questions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [questions]
  );

  const handleDelete = async (questionId: string) => {
    const confirmed = window.confirm('Delete this personalized question?');
    if (!confirmed) return;

    setIsDeletingId(questionId);
    setError(null);
    try {
      const response = await fetch(`/api/questions/${questionId}`, { method: 'DELETE' });
      if (!response.ok) {
        const json = await response.json().catch(() => ({} as { error?: string }));
        throw new Error(json.error ?? 'Delete failed');
      }
      setQuestions((prev) => prev.filter((question) => question.id !== questionId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-6 md:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#101010]">My Personalized Questions</h1>
          <p className="mt-1 text-sm text-neutral-500">Edit or delete only your personalized questions.</p>
        </div>
        <button
          onClick={() => router.push('/questions/create')}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          + Create new
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {sortedQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          You do not have any personalized questions yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedQuestions.map((question) => (
            <div
              key={question.id}
              className="rounded-2xl border border-neutral-100 bg-white px-4 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600">
                    {question.topic.name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-900 truncate">{question.statement}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {question.imageUrl ? (
                  <Image
                    src={question.imageUrl}
                    alt="Question image"
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-md border border-neutral-200 object-cover"
                    unoptimized
                  />
                ) : null}
                <Link
                  href={`/questions/${question.id}/edit`}
                  className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(question.id)}
                  disabled={isDeletingId === question.id}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isDeletingId === question.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
