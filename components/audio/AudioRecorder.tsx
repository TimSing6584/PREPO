"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  AudioRecorderProps,
  AudioRecorderStatus,
  formatRecordingDuration,
  getErrorMessage,
  MAX_RECORDING_MS,
} from "./AudioRecorder.types";
import RecordingWaveform from "./RecordingWaveform";
import {
  buildPipelineFormData,
  isPipelineSuccess,
  type PipelineResponse,
} from "./speechAssessment.types";

export default function AudioRecorder({
  statement,
  modelAnswer,
  onAssessment,
  onAssessingChange,
}: AudioRecorderProps) {
  const [status, setStatus] = useState<AudioRecorderStatus>({ kind: "idle" });
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(
    null,
  );
  const [elapsedMs, setElapsedMs] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingStartRef = useRef<number | null>(null);
  const limitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hitLimitRef = useRef(false);

  const clearRecordingTimers = useCallback(() => {
    if (limitTimerRef.current) clearTimeout(limitTimerRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    limitTimerRef.current = null;
    tickIntervalRef.current = null;
    recordingStartRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  useEffect(() => () => clearRecordingTimers(), [clearRecordingTimers]);

  useEffect(() => {
    onAssessingChange?.(status.kind === "loading");
  }, [onAssessingChange, status.kind]);

  const handleToggle = async () => {
    if (status.kind === "idle") {
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
        clearRecordingTimers();
        setElapsedMs(0);

        if (hitLimitRef.current) {
          hitLimitRef.current = false;
          toast(
            "Recording stopped — 1:30 limit reached. Only the first 1 minute 30 seconds were saved.",
            {
              icon: "⏱️",
              duration: 5000,
            },
          );
        }

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

        const form = buildPipelineFormData(blob, statement, modelAnswer);

        try {
          const res = await fetch("/api/speech-assessment", {
            method: "POST",
            body: form,
          });

          let data: PipelineResponse | null = null;
          try {
            data = (await res.json()) as PipelineResponse;
          } catch {
            setStatus({
              kind: "error",
              message: `Speech assessment failed (HTTP ${res.status}). The server returned an unexpected response.`,
            });
            return;
          }

          if (isPipelineSuccess(data)) {
            onAssessment?.(data);
            setStatus({ kind: "idle" });
          } else {
            setStatus({
              kind: "error",
              message: data.detail ?? "Speech assessment failed.",
            });
          }
        } catch {
          setStatus({
            kind: "error",
            message:
              "Could not reach the speech assessment service. Please check your connection and try again.",
          });
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      hitLimitRef.current = false;
      recordingStartRef.current = Date.now();
      setElapsedMs(0);
      tickIntervalRef.current = setInterval(() => {
        if (recordingStartRef.current) {
          setElapsedMs(Date.now() - recordingStartRef.current);
        }
      }, 200);
      limitTimerRef.current = setTimeout(() => {
        hitLimitRef.current = true;
        stopRecording();
      }, MAX_RECORDING_MS);
      setStatus({ kind: "recording" });
    } else if (status.kind === "recording") {
      stopRecording();
    }
  };

  const isRecording = status.kind === "recording";
  const isRequestingPermission = status.kind === "requesting-permission";
  const isLoading = status.kind === "loading";

  const buttonLabel = isRecording
    ? "Stop Recording"
    : isRequestingPermission
      ? "Requesting…"
      : "Record answer";

  const buttonIcon = isRecording ? (
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
  const remainingMs = Math.max(0, MAX_RECORDING_MS - elapsedMs);
  const isNearLimit = isRecording && remainingMs <= 10_000;

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
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span className="text-sm font-medium text-red-700">
                Listening…
              </span>
              <span className="text-xs text-red-400">max 1:30</span>
            </div>
            <span
              className={`tabular-nums text-sm font-semibold ${
                isNearLimit ? "text-amber-600 animate-pulse" : "text-red-600"
              }`}
              aria-live="polite"
            >
              {formatRecordingDuration(elapsedMs)} / 1:30
            </span>
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

    </div>
  );
}
