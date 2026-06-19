"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { generateServiceToken } from "@/app/utils/speech_assessment_service";
import { redis } from "@/app/utils/redis";

// "Warm" is a global fact about the single shared Render instance, so the dedup
// flag lives in Redis (not per-browser). The first caller within the TTL pings;
// everyone else just sees the flag and skips. TTL sits under Render's ~15min
// idle spin-down so the flag roughly tracks the instance's real warm state.
const WARM_FLAG_KEY = "speech-service:warmed";
const WARM_TTL_SECONDS = 12 * 60;

/**
 * Fire-and-forget warm-up for the speech assessment microservice.
 *
 * The service runs serverless on Render and cold-starts after idle, which adds
 * tens of seconds to the first request. Calling this when a logged-in user
 * shows intent (switches to "Written", or clicks "Record answer") lets the
 * instance spin up early, so the eventual /pipeline call hits a warm box.
 *
 * The microservice URL and the service JWT both stay server-side — the browser
 * never learns either.
 */
export async function warmSpeechService(): Promise<void> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return; // no real user → don't warm (blocks bots/anon)

  const serviceUrl = process.env.MICROSERVICE_URL;
  if (!serviceUrl) return;

  // Global dedup: SET NX sets the flag only if absent, returning "OK" for the
  // winner and null for everyone else within the TTL. Only the winner pings.
  let acquired: string | number | null = "OK";
  try {
    acquired = await redis.set(WARM_FLAG_KEY, Date.now(), {
      nx: true,
      ex: WARM_TTL_SECONDS,
    });
  } catch {
    // Redis unavailable → fall through and ping anyway (best-effort warm-up).
  }
  if (acquired !== "OK") return; // already warmed within the TTL

  try {
    const token = generateServiceToken(user.id);
    await fetch(`${serviceUrl.replace(/\/$/, "")}/health`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      // Don't let a slow cold start hang the action; landing the request is
      // enough to trigger Render's spin-up — we don't wait for boot to finish.
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Best-effort: a failed/timed-out ping still triggered the spin-up, and if
    // it didn't, the user just gets the normal cold start on submit.
  }
}
