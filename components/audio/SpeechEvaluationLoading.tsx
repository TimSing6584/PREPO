"use client";

export default function SpeechEvaluationLoading() {
  return (
    <div
      className="rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-6 shadow-sm animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-4">
        <span
          className="h-8 w-8 shrink-0 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-primary-900">
            Evaluating your answer…
          </p>
          <p className="text-xs text-primary-700/80">
            Transcribing speech and comparing it to the model answer. This may
            take a moment.
          </p>
        </div>
      </div>
    </div>
  );
}
