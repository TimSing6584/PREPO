"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutList,
  ListChecks,
  Mic,
  PenLine,
  RotateCcw,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PracticeTutorialModalProps = {
  open: boolean;
  onClose: () => void;
};

const VISUAL_ROOT_CLASS =
  "flex flex-col justify-center gap-2 w-full min-h-[5.75rem]";

const STEPS = [
  {
    tag: "Modes",
    tagColor: "bg-primary-500",
    icon: Zap,
    title: "Two ways to practice",
    description:
      "Switch between Open-ended and Multiple choice at the top of each question. Pick the style that matches how you want to drill the topic.",
    visual: (
      <div className={VISUAL_ROOT_CLASS}>
        <div className="bg-neutral-100 rounded-lg p-1 flex items-center gap-1 w-fit">
          <div className="px-3 py-1.5 rounded-md bg-white text-xs font-semibold text-black shadow-sm">
            Open-ended
          </div>
          <div className="px-3 py-1.5 rounded-md text-xs font-semibold text-neutral-500">
            Multiple choice
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: "Open-ended",
    tagColor: "bg-blue-500",
    icon: PenLine,
    title: "Write to get AI evaluation",
    description:
      "Type your answer in the text box, then submit it to get instant AI feedback on how well you explained the concept.",
    visual: (
      <div className={VISUAL_ROOT_CLASS}>
        <div className="h-10 rounded-xl border-2 border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-400">
          Type your answer here...
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white">
            Submit
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-600 shrink-0" />
            <span className="text-xs font-semibold text-fuchsia-700">
              AI evaluation
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: "AI Feedback",
    tagColor: "bg-fuchsia-500",
    icon: Mic,
    title: "Speak for AI feedback",
    description:
      "Prefer talking it out? Record your answer aloud and get instant AI feedback on how clearly you explained the concept.",
    visual: (
      <div className={VISUAL_ROOT_CLASS}>
        <div className="flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2.5">
          <Mic className="h-4 w-4 text-primary-600 shrink-0" />
          <span className="text-xs font-semibold text-primary-700">
            Record answer for AI feedback
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-3 py-2.5">
          <Sparkles className="h-4 w-4 text-fuchsia-600 shrink-0" />
          <span className="text-xs font-semibold text-fuchsia-700">
            Instant speech assessment
          </span>
        </div>
      </div>
    ),
  },
  {
    tag: "MCQ",
    tagColor: "bg-emerald-500",
    icon: ListChecks,
    title: "Rapid multiple choice",
    description:
      "Pick an option and submit for instant feedback. Wrong answers nudge you to star the question for later review.",
    visual: (
      <div className={VISUAL_ROOT_CLASS}>
        {[
          { label: "Correct option", state: "correct" },
          { label: "Another option", state: "default" },
          { label: "Wrong pick", state: "wrong" },
        ].map((opt) => (
          <div
            key={opt.label}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-medium",
              opt.state === "correct" &&
                "border-emerald-300 bg-emerald-50 text-emerald-800",
              opt.state === "wrong" && "border-red-300 bg-red-50 text-red-800",
              opt.state === "default" &&
                "border-neutral-200 bg-white text-neutral-600",
            )}
          >
            {opt.label}
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Progress",
    tagColor: "bg-indigo-500",
    icon: LayoutList,
    title: "Star and redo",
    description:
      "Star tricky questions to review later. Redo resets the current question, while Redo all resets every question on the current page.",
    visual: (
      <div className={VISUAL_ROOT_CLASS}>
        <div className="flex items-center gap-3">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold text-neutral-700">
            Star for later review
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-neutral-500">
            <RotateCcw className="h-3.5 w-3.5" />
            Redo
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
            <RotateCcw className="h-3 w-3" />
            Redo all
          </div>
        </div>
      </div>
    ),
  },
] as const;

export default function PracticeTutorialModal({
  open,
  onClose,
}: PracticeTutorialModalProps) {
  const [step, setStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });
  }, [open, step]);

  const goNext = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  if (!open) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close tutorial"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="practice-tutorial-title"
        aria-describedby="practice-tutorial-description"
        tabIndex={-1}
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-[2rem] border border-neutral-100 shadow-2xl overflow-hidden outline-none"
      >
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-white",
              current.tagColor,
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {current.tag}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 sm:px-6 pt-4 pb-2 space-y-4">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 h-36 shrink-0 overflow-hidden">
            <div className="h-full w-full flex items-center justify-center p-4 sm:p-5">
              {current.visual}
            </div>
          </div>

          <div className="space-y-2">
            <h2
              id="practice-tutorial-title"
              className="text-xl sm:text-2xl font-bold text-[#101010] leading-tight"
            >
              {current.title}
            </h2>
            <p
              id="practice-tutorial-description"
              className="text-sm text-neutral-500 leading-relaxed"
            >
              {current.description}
            </p>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-neutral-100 flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setStep(index)}
                aria-label={`Go to step ${index + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === step ? "w-8 bg-primary-500" : "w-2 bg-neutral-200",
                )}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              Skip
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={isFirst}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  Start practicing
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-[11px] font-medium text-neutral-400">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
      </div>
    </div>
  );
}
