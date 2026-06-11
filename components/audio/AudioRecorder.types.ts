import type { SpeechAssessment } from "./speechAssessment.types";

export type { SpeechAssessment };

/** Maximum recording duration before auto-stop (1 minute 30 seconds). */
export const MAX_RECORDING_MS = 90_000;

export function formatRecordingDuration(ms: number): string {
    const totalSeconds = Math.min(Math.floor(ms / 1000), MAX_RECORDING_MS / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Discriminated union representing every possible state of the AudioRecorder component.
 */
export type AudioRecorderStatus =
    | { kind: 'idle' }
    | { kind: 'requesting-permission' }
    | { kind: 'recording' }
    | { kind: 'loading' }
    | { kind: 'error'; message: string };

/**
 * Props accepted by the AudioRecorder component.
 */
export interface AudioRecorderProps {
    statement: string;
    modelAnswer: string;
    /** Called with the full assessment result for persistence. */
    onAssessment?: (assessment: SpeechAssessment) => void;
    onAssessingChange?: (isAssessing: boolean) => void;
}

/**
 * Maps a caught error value to a user-facing string message.
 */
export function getErrorMessage(err: unknown): string {
    if (err instanceof DOMException) {
        switch (err.name) {
            case 'NotAllowedError':
                return 'Microphone access was denied. Please allow microphone access and try again.';
            case 'NotFoundError':
                return 'No microphone was found. Please connect a microphone and try again.';
        }
    }

    if (err instanceof Error) {
        return err.message;
    }

    return 'An unexpected error occurred. Please try again.';
}
