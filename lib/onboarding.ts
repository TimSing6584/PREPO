const PRACTICE_TUTORIAL_VERSION = "v1";

export function practiceTutorialStorageKey(userId: string) {
  return `prepo:onboarding:practice:${PRACTICE_TUTORIAL_VERSION}:${userId}`;
}

export function hasSeenPracticeTutorial(userId: string): boolean {
  try {
    const raw = localStorage.getItem(practiceTutorialStorageKey(userId));
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { seen?: boolean };
    return parsed.seen === true;
  } catch {
    return false;
  }
}

export function markPracticeTutorialSeen(userId: string): void {
  try {
    localStorage.setItem(
      practiceTutorialStorageKey(userId),
      JSON.stringify({ seen: true, seenAt: Date.now() }),
    );
  } catch {
    // ignore storage errors
  }
}
