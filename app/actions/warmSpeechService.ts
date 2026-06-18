"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { generateServiceToken } from "@/app/utils/speech_assessment_service";

/**
 * Fire-and-forget warm-up for the speech assessment microservice.
 *
 * The service runs serverless on Render and cold-starts after idle, which adds
 * tens of seconds to the first request. Calling this when a logged-in user
 * shows intent to record (clicks "Record answer") lets the instance spin up
 * while they speak, so the eventual /api/speech-assessment call hits a warm box.
 *
 * The microservice URL and the service JWT both stay server-side — the browser
 * never learns either. The /health probe is JWT-protected like every other
 * route, so we mint and send a token here; this keeps the warm-up from being an
 * anonymously-abusable keep-warm endpoint.
 */
export async function warmSpeechService(): Promise<void> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return; // no real user → don't warm (blocks bots/anon)

  const serviceUrl = process.env.MICROSERVICE_URL;
  if (!serviceUrl) return;

  try {
    const token = generateServiceToken(user.id);
    await fetch(`${serviceUrl.replace(/\/$/, "")}/health`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      // Don't let a slow cold start hang the action; we only need to land the
      // request that triggers the spin-up, not wait for it to finish booting.
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Best-effort: a failed/timed-out ping still wakes the instance, and if it
    // doesn't, the user just gets the normal cold start on submit.
  }
}
