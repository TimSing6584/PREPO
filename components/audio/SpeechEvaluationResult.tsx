"use client";

import {
  formatScore,
  scoreColorClass,
  type SpeechEvaluation,
} from "./speechEvaluation.types";

interface SpeechEvaluationResultProps {
  evaluation: SpeechEvaluation;
}

export default function SpeechEvaluationResult({
  evaluation,
}: SpeechEvaluationResultProps) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white px-5 py-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Speech evaluation
        </h2>
        <div className="text-right">
          <p className="text-xs font-medium text-neutral-400">Score</p>
          <p
            className={`text-2xl font-bold tabular-nums ${scoreColorClass(evaluation.score)}`}
          >
            {formatScore(evaluation.score)}
          </p>
        </div>
      </div>

      <hr className="my-4 border-neutral-100" />

      <div className="space-y-4">
        <div>
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Transcript
          </h3>
          <p className="whitespace-pre-wrap text-neutral-800">
            {evaluation.transcript}
          </p>
        </div>

        <div>
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Feedback
          </h3>
          <p className="whitespace-pre-wrap text-neutral-700">
            {evaluation.feedback}
          </p>
        </div>
      </div>
    </div>
  );
}
