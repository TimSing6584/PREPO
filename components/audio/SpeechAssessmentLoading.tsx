"use client";

import { useEffect, useState } from "react";

// Shown in order, advancing on an interval, to reassure the user that work is
// progressing during the (sometimes slow) cold-start + pipeline run. The last
// message stays put once reached rather than looping back to the start.
const LOADING_MESSAGES = [
  "Warming up the assessment service…",
  "Transcribing your speech…",
  "Comparing it to the model answer…",
  "Scoring your answer…",
  "Almost there…",
];

const MESSAGE_INTERVAL_MS = 2500;

export default function SpeechAssessmentLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

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
            Assessing your answer…
          </p>
          <p
            key={index}
            className="text-xs text-primary-700/80 animate-in fade-in duration-500"
          >
            {LOADING_MESSAGES[index]}
          </p>
        </div>
      </div>
    </div>
  );
}
