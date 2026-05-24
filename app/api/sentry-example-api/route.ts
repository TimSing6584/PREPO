import * as Sentry from "@sentry/nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import type { KindeAccessToken } from "@kinde-oss/kinde-auth-nextjs/types";
import { checkRateLimit } from "@/app/utils/ratelimit";

export const dynamic = "force-dynamic";

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

// A faulty API route to test Sentry's error monitoring — admin only
export async function GET() {
  const { getUser, getAccessToken } = getKindeServerSession();
  const [user, token] = await Promise.all([getUser(), getAccessToken()]);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const roles = (token as KindeAccessToken)?.roles as { key: string }[] | undefined;
  const isAdmin = roles?.some((r) => r.key === "admin") ?? false;

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimitError = await checkRateLimit("write");
  if (rateLimitError) return rateLimitError;

  Sentry.logger.info("Sentry example API called");
  throw new SentryExampleAPIError(
    "This error is raised on the backend called by the example page.",
  );
}
