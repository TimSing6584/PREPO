import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/app/utils/ratelimit";

const MAX_AUDIO_BYTES = 15 * 1024 * 1024;
const ALLOWED_AUDIO_TYPES = new Set([
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
]);

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { detail: "Not authenticated" },
        { status: 401 },
      );
    }

    const rateLimitError = await checkRateLimit("upload");
    if (rateLimitError) {
      const body = await rateLimitError.json();
      return NextResponse.json(
        { detail: body.error ?? "Too many requests. Please slow down." },
        { status: 429 },
      );
    }

    const serviceUrl = process.env.MICROSERVICE_URL;
    if (!serviceUrl) {
      return NextResponse.json(
        { detail: "Speech assessment service is not configured." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");
    const statement = formData.get("statement");
    const modelAnswer = formData.get("model_answer");

    if (!audio || !(audio instanceof File)) {
      return NextResponse.json(
        { detail: "Audio file is required." },
        { status: 400 },
      );
    }

    if (typeof statement !== "string" || !statement.trim()) {
      return NextResponse.json(
        { detail: "Question statement is required." },
        { status: 400 },
      );
    }

    if (typeof modelAnswer !== "string" || !modelAnswer.trim()) {
      return NextResponse.json(
        { detail: "Model answer is required." },
        { status: 400 },
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        { detail: "Recording was empty. Please try again." },
        { status: 400 },
      );
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        {
          detail:
            "Recording is too large. Please keep it under 1 minute 30 seconds.",
        },
        { status: 400 },
      );
    }

    if (audio.type && !ALLOWED_AUDIO_TYPES.has(audio.type)) {
      return NextResponse.json(
        { detail: "Unsupported audio format." },
        { status: 400 },
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append("audio", audio, audio.name || "recording.webm");
    upstreamForm.append("statement", statement.trim());
    upstreamForm.append("model_answer", modelAnswer.trim());

    const upstream = await fetch(
      `${serviceUrl.replace(/\/$/, "")}/pipeline/speech-assess`,
      {
        method: "POST",
        body: upstreamForm,
      },
    );

    const responseText = await upstream.text();
    let payload: unknown;
    try {
      payload = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          detail: `Speech assessment failed (HTTP ${upstream.status}). The service returned an unexpected response.`,
        },
        { status: upstream.ok ? 502 : upstream.status },
      );
    }

    return NextResponse.json(payload, { status: upstream.status });
  } catch {
    return NextResponse.json(
      {
        detail:
          "Could not reach the speech assessment service. Please check your connection and try again.",
      },
      { status: 502 },
    );
  }
}
