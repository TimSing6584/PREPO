"use client";

import { useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import {
  AudioRecorderProps,
  AudioRecorderStatus,
  buildFormData,
  getErrorMessage,
  isSuccess,
  TranscribeResponse,
} from "./AudioRecorder.types";
import RecordingWaveform from "./RecordingWaveform";

export default function AudioRecorder({ onTranscript }: AudioRecorderProps) {
  const [status, setStatus] = useState<AudioRecorderStatus>({ kind: "idle" });
  const [transcript, setTranscript] = useState<string | null>(null);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const handleToggle = async () => {
    if (status.kind === "idle") {
      // Guard against browsers that don't support MediaRecorder
      if (typeof MediaRecorder === "undefined") {
        setStatus({
          kind: "error",
          message: "Audio recording is not supported in this browser.",
        });
        return;
      }

      setStatus({ kind: "requesting-permission" });

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        setStatus({ kind: "error", message: getErrorMessage(err) });
        return;
      }

      streamRef.current = stream;
      setRecordingStream(stream);
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setRecordingStream(null);

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        if (blob.size === 0) {
          setStatus({
            kind: "error",
            message: "Recording was empty. Please try again.",
          });
          return;
        }

        setStatus({ kind: "loading" });

        const form = buildFormData(blob);

        try {
          const res = await fetch("http://localhost:8000/transcription", {
            method: "POST",
            body: form,
          });

          let data: TranscribeResponse | null = null;
          try {
            data = (await res.json()) as TranscribeResponse;
          } catch {
            // Response body wasn't valid JSON
            setStatus({
              kind: "error",
              message: `Transcription failed (HTTP ${res.status}). The server returned an unexpected response.`,
            });
            return;
          }

          if (isSuccess(data)) {
            setTranscript(data.transcript);
            onTranscript?.(data.transcript);
            setStatus({ kind: "idle" });
          } else {
            setStatus({ kind: "error", message: data.detail });
          }
        } catch {
          setStatus({
            kind: "error",
            message:
              "Could not reach the transcription service. Please check your connection and try again.",
          });
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setStatus({ kind: "recording" });
    } else if (status.kind === "recording") {
      mediaRecorderRef.current?.stop();
    }
  };

  // Derive button props from current status
  const isRecording = status.kind === "recording";
  const isRequestingPermission = status.kind === "requesting-permission";
  const isLoading = status.kind === "loading";

  const buttonLabel = isRecording
    ? "Stop Recording"
    : isRequestingPermission
      ? "Requesting…"
      : isLoading
        ? "Transcribing…"
        : "Start Recording";

  const buttonIcon = isLoading ? (
    <span
      className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"
      aria-hidden="true"
    />
  ) : isRecording ? (
    <MicOff className="h-5 w-5" />
  ) : (
    <Mic className="h-5 w-5" />
  );

  const buttonClasses = isRecording
    ? "inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium bg-red-500 text-white"
    : isRequestingPermission || isLoading
      ? "inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium bg-neutral-200 text-neutral-500"
      : "inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium bg-primary-600 text-white";

  const isDisabled = isRequestingPermission || isLoading;

  const button = (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleToggle}
      className={buttonClasses}
    >
      {buttonIcon}
      {buttonLabel}
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      {isRecording && recordingStream && (
        <div
          className="rounded-2xl border border-red-200 bg-red-50/60 p-4 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300"
          role="status"
          aria-live="polite"
        >
          <div className="mb-3 flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-medium text-red-700">Listening…</span>
            <span className="text-xs text-red-400">speak now</span>
          </div>
          <RecordingWaveform stream={recordingStream} />
        </div>
      )}

      {isRecording ? (
        <span className="relative inline-flex self-start">
          <span
            className="absolute -inset-1 rounded-2xl bg-red-400/30 blur-sm animate-pulse pointer-events-none"
            aria-hidden="true"
          />
          {button}
        </span>
      ) : (
        button
      )}

      {/* Error banner — only when status.kind === 'error' */}
      {status.kind === "error" && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <span aria-hidden="true">⚠</span>
          <span className="flex-1">{status.message}</span>
          <button
            type="button"
            onClick={() => setStatus({ kind: "idle" })}
            className="ml-auto shrink-0"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Transcript card — only when transcript !== null */}
      {transcript !== null && (
        <div className="rounded-2xl border border-neutral-100 bg-white px-5 py-4 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
            Transcript
          </h2>
          <hr className="my-2 border-neutral-100" />
          <p className="text-neutral-800 whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
    </div>
  );
}
