import { warmSpeechService } from "@/app/actions/warmSpeechService";

// Module-level (one per tab), shared by every trigger point. This is only a
// burst guard to avoid hammering the server action on rapid clicks/re-renders —
// the authoritative "is it already warm" dedup is global, in Redis, inside the
// server action.
let lastTriggeredAt = 0;
const COOLDOWN_MS = 60 * 1000;

/**
 * Fire-and-forget warm-up trigger, safe to call from any client interaction
 * (e.g. switching to "Written" mode, clicking "Record answer"). Never blocks
 * the UI; failures are swallowed by the server action.
 */
export function triggerWarmSpeech(): void {
  // Only warm for a user actually looking at the page, not background tabs.
  if (typeof document !== "undefined" && document.visibilityState !== "visible") {
    return;
  }

  const now = Date.now();
  if (now - lastTriggeredAt < COOLDOWN_MS) return;
  lastTriggeredAt = now;

  void warmSpeechService();
}
