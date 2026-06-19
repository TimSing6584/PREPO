"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import TipTapEditor from "@/components/TipTap/TipTapEditor";
import AudioRecorder from "@/components/audio/AudioRecorder";
import { triggerWarmSpeech } from "@/components/audio/warmSpeechClient";
import SpeechAssessmentLoading from "@/components/audio/SpeechAssessmentLoading";
import SpeechAssessmentResult from "@/components/audio/SpeechAssessmentResult";
import type { SpeechAssessment } from "@/components/audio/speechAssessment.types";
import type { ComponentProps } from "react";

interface WrittenViewProps {
  statement: string;
  correctAnswer: string;
  initialDraft?: string;
  initialSpeechAssessment?: SpeechAssessment | null;
  onDraftChange?: (draft: string) => void;
  onSpeechAssessmentChange?: (assessment: SpeechAssessment) => void;
}

type EditorContent = NonNullable<
  ComponentProps<typeof TipTapEditor>["initialContent"]
>;

const hasRichTextShape = (
  value: unknown,
): value is Exclude<EditorContent, string> => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { type?: unknown };
  return candidate.type === "doc";
};

function extractTipTapText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const candidate = node as { text?: string; content?: unknown[] };
  if (typeof candidate.text === "string") return candidate.text;
  if (!Array.isArray(candidate.content)) return "";
  return candidate.content.map(extractTipTapText).join("");
}

function toPlainAnswer(correctAnswer: string): string {
  try {
    const parsed = JSON.parse(correctAnswer) as unknown;
    if (hasRichTextShape(parsed)) {
      const text = extractTipTapText(parsed).trim();
      if (text) return text;
    }
  } catch {
    // fall through to raw string
  }
  return correctAnswer.trim();
}

export default function WrittenView({
  statement,
  correctAnswer,
  initialDraft = "",
  initialSpeechAssessment = null,
  onDraftChange,
  onSpeechAssessmentChange,
}: WrittenViewProps) {
  const [answer, setAnswer] = useState(initialDraft);
  const [showAnswer, setShowAnswer] = useState(false);
  const [speechAssessment, setSpeechAssessment] =
    useState<SpeechAssessment | null>(initialSpeechAssessment);
  const [isAssessing, setIsAssessing] = useState(false);

  const modelAnswer = useMemo(
    () => toPlainAnswer(correctAnswer),
    [correctAnswer],
  );

  const parsedCorrectAnswer = useMemo(() => {
    try {
      const parsed = JSON.parse(correctAnswer) as unknown;
      return hasRichTextShape(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, [correctAnswer]);

  // The written view is the only place audio is recorded, so its presence is the
  // earliest reliable signal the user will hit the (serverless) assessment
  // service. Warm it whenever this view shows a question — covers switching to
  // "Written", resuming a question already in written mode (persisted), and
  // navigating between questions. Globally deduped, so repeat fires are cheap.
  useEffect(() => {
    triggerWarmSpeech();
  }, [statement]);

  useEffect(() => {
    setAnswer(initialDraft);
  }, [initialDraft]);

  useEffect(() => {
    setSpeechAssessment(initialSpeechAssessment);
  }, [initialSpeechAssessment]);

  return (
    <div className="space-y-6">
      <textarea
        value={answer}
        onChange={(e) => {
          const value = e.target.value;
          setAnswer(value);
          onDraftChange?.(value);
        }}
        placeholder="Type your answer here..."
        className="w-full h-40 p-4 rounded-xl border-2 border-neutral-200 focus:border-blue-500 focus:ring-0 resize-none transition-all placeholder:text-neutral-400"
      />

      <AudioRecorder
        statement={statement}
        modelAnswer={modelAnswer}
        onAssessingChange={setIsAssessing}
        onAssessment={(assessment) => {
          setSpeechAssessment(assessment);
          onSpeechAssessmentChange?.(assessment);
        }}
      />

      {isAssessing && <SpeechAssessmentLoading />}

      {speechAssessment && !isAssessing && (
        <SpeechAssessmentResult assessment={speechAssessment} />
      )}

      <div className="space-y-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          {showAnswer ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>

        {showAnswer && (
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            {parsedCorrectAnswer ? (
              <TipTapEditor
                initialContent={parsedCorrectAnswer}
                editable={false}
                showToolbar={false}
                containerClassName="w-full border-0 bg-transparent rounded-none"
                editorClassName="min-h-0 bg-transparent p-0 text-emerald-900"
              />
            ) : (
              <p className="whitespace-pre-wrap text-emerald-900">
                {correctAnswer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
