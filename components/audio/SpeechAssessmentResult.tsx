"use client";

import {
  formatScore,
  scoreColorClass,
  type SpeechAssessment,
} from "./speechAssessment.types";

interface SpeechAssessmentResultProps {
  assessment: SpeechAssessment;
}

export default function SpeechAssessmentResult({
  assessment,
}: SpeechAssessmentResultProps) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white px-5 py-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Speech assessment
        </h2>
        <div className="text-right">
          <p className="text-xs font-medium text-neutral-400">Score</p>
          <p
            className={`text-2xl font-bold tabular-nums ${scoreColorClass(assessment.score)}`}
          >
            {formatScore(assessment.score)}
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
            {assessment.transcript}
          </p>
        </div>

        <div>
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Feedback
          </h3>
          <p className="whitespace-pre-wrap text-neutral-700">
            {assessment.feedback}
          </p>
        </div>
      </div>
    </div>
  );
}
