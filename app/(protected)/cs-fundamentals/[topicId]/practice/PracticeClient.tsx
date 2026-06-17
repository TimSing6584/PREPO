"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/main/Navbar";
import QuestionSidebar from "@/components/cs-fundamentals/practice/QuestionSidebar";
import QuestionCard from "@/components/cs-fundamentals/practice/QuestionCard";
import type { PracticeQuestion } from "@/components/cs-fundamentals/practice/types";
import {
  mergeQuestionProgress,
  type QuestionProgressPatch,
  type StoredQuestionProgress,
} from "@/components/cs-fundamentals/practice/progress";
import type {
  PaginationMeta,
  QuestionFilter,
} from "@/app/utils/server/csFundamentals";
import { ArrowLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PracticeClientProps = {
  userId: string;
  topicId: string;
  topicName: string;
  questions: PracticeQuestion[];
  orderedQuestionIds: string[];
  globalOrderedQuestionIds: string[];
  selectedQuestion: PracticeQuestion | null;
  initialQuestionId: string;
  pagination: PaginationMeta;
  filter: QuestionFilter;
};

type PracticeProgressStore = {
  questions: Record<string, StoredQuestionProgress>;
  updatedAt: number;
};

const storageKeyForTopic = (userId: string, topicId: string) =>
  `practiceProgress:v2:${userId}:${topicId}`;
const mobileSidebarOpenKeyForTopic = (topicId: string) =>
  `practiceMobileSidebarOpen:v1:${topicId}`;

export default function PracticeClient({
  userId,
  topicId,
  topicName,
  questions,
  orderedQuestionIds,
  globalOrderedQuestionIds,
  selectedQuestion,
  initialQuestionId,
  pagination,
  filter,
}: PracticeClientProps) {
  const router = useRouter();

  const initialStarredIds = useMemo(
    () => questions.filter((q) => q.isStarred).map((q) => q.id),
    [questions],
  );

  const [currentQuestionId, setCurrentQuestionId] = useState(initialQuestionId);
  const [progressByQuestion, setProgressByQuestion] = useState<
    Record<string, StoredQuestionProgress>
  >({});
  const [starredIds, setStarredIds] = useState<string[]>(initialStarredIds);
  const [sidebarFilter, setSidebarFilter] = useState<QuestionFilter>(
    filter === "starred" ? "starred" : "all",
  );
  const [hasHydratedProgress, setHasHydratedProgress] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarOpenButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setSidebarOpen(
        sessionStorage.getItem(mobileSidebarOpenKeyForTopic(topicId)) ===
          "true",
      );
    } catch {
      setSidebarOpen(false);
    }
  }, [topicId, pagination.page]);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    try {
      sessionStorage.setItem(mobileSidebarOpenKeyForTopic(topicId), "true");
    } catch {
      // ignore storage errors
    }
  }, [topicId]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    try {
      sessionStorage.removeItem(mobileSidebarOpenKeyForTopic(topicId));
    } catch {
      // ignore storage errors
    }
    requestAnimationFrame(() => {
      sidebarOpenButtonRef.current?.focus();
    });
  }, [topicId]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, closeSidebar]);

  useEffect(() => {
    if (!sidebarOpen) return;
    requestAnimationFrame(() => {
      const closeButton = sidebarPanelRef.current?.querySelector<HTMLElement>(
        'button[aria-label="Close question list"]',
      );
      closeButton?.focus();
    });
  }, [sidebarOpen, pagination.page]);

  // Sync initialQuestionId when navigation changes it
  useEffect(() => {
    setCurrentQuestionId(initialQuestionId);
  }, [initialQuestionId]);

  // Hydrate progress from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKeyForTopic(userId, topicId));
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PracticeProgressStore>;
        setProgressByQuestion(parsed.questions ?? {});
      }
    } catch {
      setProgressByQuestion({});
    } finally {
      setHasHydratedProgress(true);
    }
  }, [topicId, userId]);

  // Persist progress to localStorage
  useEffect(() => {
    if (!hasHydratedProgress) return;
    const payload: PracticeProgressStore = {
      questions: progressByQuestion,
      updatedAt: Date.now(),
    };
    localStorage.setItem(
      storageKeyForTopic(userId, topicId),
      JSON.stringify(payload),
    );
  }, [hasHydratedProgress, progressByQuestion, topicId, userId]);

  // Sync starred when topic/questions change
  useEffect(() => {
    setStarredIds(initialStarredIds);
  }, [initialStarredIds, topicId]);

  useEffect(() => {
    setSidebarFilter(filter === "starred" ? "starred" : "all");
  }, [filter, topicId]);

  const sidebarQuestions = useMemo(() => {
    if (filter === "starred") return questions;
    if (sidebarFilter === "starred") {
      return questions.filter((q) => starredIds.includes(q.id));
    }
    return questions;
  }, [filter, questions, sidebarFilter, starredIds]);

  const globalNumberById = useMemo(
    () =>
      Object.fromEntries(
        globalOrderedQuestionIds.map((id, index) => [id, index + 1]),
      ),
    [globalOrderedQuestionIds],
  );

  const questionById = useMemo(() => {
    const combinedQuestions = selectedQuestion
      ? [
          selectedQuestion,
          ...questions.filter((q) => q.id !== selectedQuestion.id),
        ]
      : questions;
    return new Map(combinedQuestions.map((q) => [q.id, q]));
  }, [questions, selectedQuestion]);

  // Derived state
  const completedIds = sidebarQuestions
    .filter((q) => {
      const progress = progressByQuestion[q.id];
      return (
        progress?.mcq?.isSubmitted === true ||
        (progress?.written?.draft ?? "").trim().length > 0
      );
    })
    .map((q) => q.id);

  const currentQuestion =
    questionById.get(currentQuestionId) ??
    selectedQuestion ??
    sidebarQuestions[0];
  const currentNavigationIndex = currentQuestion
    ? orderedQuestionIds.findIndex((id) => id === currentQuestion.id)
    : -1;
  const currentGlobalIndex = currentQuestion
    ? globalOrderedQuestionIds.findIndex((id) => id === currentQuestion.id)
    : -1;

  // Page navigation (URL-based)
  function buildUrl(page: number, f: QuestionFilter, questionId: string) {
    const qParam = questionId ? `&q=${encodeURIComponent(questionId)}` : "";
    return `/cs-fundamentals/${topicId}/practice?page=${page}&filter=${f}${qParam}`;
  }

  function goToPage(page: number) {
    router.push(buildUrl(page, filter, currentQuestionId));
  }

  function handleFilterChange(newFilter: QuestionFilter) {
    if (filter === "starred") {
      if (newFilter === "starred") return;
      const selectedIndex = currentQuestionId
        ? globalOrderedQuestionIds.findIndex((id) => id === currentQuestionId)
        : -1;
      const targetPage =
        selectedIndex >= 0
          ? Math.floor(selectedIndex / pagination.pageSize) + 1
          : 1;
      router.push(buildUrl(targetPage, "all", currentQuestionId));
      return;
    }
    setSidebarFilter(newFilter);
  }

  function getPageForQuestion(questionId: string) {
    const index = globalOrderedQuestionIds.findIndex((qid) => qid === questionId);
    if (index < 0) return pagination.page;
    return Math.floor(index / pagination.pageSize) + 1;
  }

  function selectQuestion(id: string) {
    if (id === currentQuestionId) {
      closeSidebar();
      return;
    }

    setCurrentQuestionId(id);
    closeSidebar();

    const targetPage = getPageForQuestion(id);
    const url = buildUrl(targetPage, filter, id);
    const isOnCurrentPage = questions.some((q) => q.id === id);

    // Same-page switch: update URL without a server round-trip
    if (isOnCurrentPage && targetPage === pagination.page) {
      window.history.replaceState(window.history.state, "", url);
      return;
    }

    router.replace(url);
  }

  // Redo current page
  function redoCurrentPage() {
    const pageQuestionIds = new Set(questions.map((q) => q.id));
    setProgressByQuestion((prev) => {
      const next = { ...prev };
      for (const id of pageQuestionIds) {
        delete next[id];
      }
      return next;
    });
  }

  // Star toggle
  const toggleStar = async (id: string) => {
    const willStar = !starredIds.includes(id);
    setStarredIds((prev) =>
      willStar ? [...prev, id] : prev.filter((s) => s !== id),
    );

    try {
      const response = await fetch("/api/starred-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: id, starred: willStar }),
      });
      if (!response.ok) throw new Error("Failed to update starred question");
    } catch {
      // Revert optimistic update
      setStarredIds((prev) =>
        willStar ? prev.filter((s) => s !== id) : [...prev, id],
      );
    }
  };

  const sidebarProps = {
    questions: sidebarQuestions,
    currentQuestionId,
    onSelectQuestion: selectQuestion,
    completedIds,
    starredIds,
    filter: sidebarFilter,
    showFilterTabs: true as const,
    onFilterChange: handleFilterChange,
    onRedoPage: redoCurrentPage,
    pagination,
    globalNumberById,
    onPageChange: goToPage,
  };

  return (
    <div className="main-frame px-4 sm:px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-3 sm:gap-4 md:gap-6 font-geist-sans">
      <Navbar />

      <div className="flex-1 flex min-h-0 -mx-4 sm:-mx-6 md:-mx-12 -mb-6 md:-mb-12">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-80 h-full flex-shrink-0 border-r border-neutral-100 bg-white/50">
          <QuestionSidebar {...sidebarProps} />
        </div>

        {/* Mobile sidebar drawer — only mounted while open so focus can't linger hidden */}
        {sidebarOpen ? (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Question list"
          >
            <button
              type="button"
              aria-label="Close question list overlay"
              onClick={closeSidebar}
              className="absolute inset-0 bg-black/40"
            />
            <div
              ref={sidebarPanelRef}
              className="absolute inset-y-0 left-0 h-full w-[min(100vw-2.5rem,20rem)] border-r border-neutral-100 bg-white shadow-xl"
            >
              <QuestionSidebar
                {...sidebarProps}
                showCloseButton
                onClose={closeSidebar}
              />
            </div>
          </div>
        ) : null}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-20">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between px-1 sm:px-2">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/cs-fundamentals/${topicId}?page=${pagination.page}&filter=${filter}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Back to Questions
                </Link>
                <button
                  ref={sidebarOpenButtonRef}
                  type="button"
                  onClick={openSidebar}
                  className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Menu className="h-3.5 w-3.5" />
                  Questions
                </button>
              </div>
              <div className="text-xs font-medium text-neutral-400 flex items-center gap-2 min-w-0">
                <span className="shrink-0">Topic:</span>
                <span className="text-neutral-900 uppercase tracking-wider font-bold truncate">
                  {topicName}
                </span>
              </div>
            </div>

            {!currentQuestion ? (
              <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50 px-4 py-10 text-center text-sm text-amber-800">
                {filter === "starred"
                  ? "You have no starred questions yet. Click the star icon on any question to save it for later review."
                  : "No starred questions on this page yet."}
              </div>
            ) : currentQuestion ? (
              <QuestionCard
                key={currentQuestion.id}
                currentGlobalIndex={
                  currentGlobalIndex >= 0 ? currentGlobalIndex : undefined
                }
                question={currentQuestion}
                starred={starredIds.includes(currentQuestion.id)}
                onToggleStar={() => toggleStar(currentQuestion.id)}
                onPreviousQuestion={() => {
                  if (currentNavigationIndex <= 0) return;
                  selectQuestion(
                    orderedQuestionIds[currentNavigationIndex - 1],
                  );
                }}
                onNextQuestion={() => {
                  if (
                    currentNavigationIndex < 0 ||
                    currentNavigationIndex >= orderedQuestionIds.length - 1
                  )
                    return;
                  selectQuestion(
                    orderedQuestionIds[currentNavigationIndex + 1],
                  );
                }}
                canGoPrevious={currentNavigationIndex > 0}
                canGoNext={
                  currentNavigationIndex >= 0 &&
                  currentNavigationIndex < orderedQuestionIds.length - 1
                }
                onRedo={() =>
                  setProgressByQuestion((prev) => {
                    const next = { ...prev };
                    delete next[currentQuestion.id];
                    return next;
                  })
                }
                progress={progressByQuestion[currentQuestion.id]}
                onProgressChange={(patch: QuestionProgressPatch) =>
                  setProgressByQuestion((prev) => ({
                    ...prev,
                    [currentQuestion.id]: mergeQuestionProgress(
                      prev[currentQuestion.id],
                      patch,
                    ),
                  }))
                }
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500">
                No questions available for this topic.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
