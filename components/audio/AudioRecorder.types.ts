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
 * All props are optional — the component is fully self-contained without any.
 */
export interface AudioRecorderProps {
    /** Called with the transcript text whenever a successful response is received. */
    onTranscript?: (transcript: string) => void;
}

/**
 * Successful response shape from the Transcription_API.
 */
export interface TranscribeSuccessResponse {
    transcript: string;
}

/**
 * Error response shape from the Transcription_API.
 */
export interface TranscribeErrorResponse {
    detail: string;
}

/**
 * Union of all possible Transcription_API response shapes.
 */
export type TranscribeResponse = TranscribeSuccessResponse | TranscribeErrorResponse;

/**
 * Type guard that narrows a TranscribeResponse to a TranscribeSuccessResponse.
 *
 * Returns true when the response contains a `transcript` field.
 */
export function isSuccess(r: TranscribeResponse): r is TranscribeSuccessResponse {
    return 'transcript' in r;
}

/**
 * Constructs the multipart FormData payload required by the Transcription_API.
 *
 * The blob is appended under field name `"audio"` with filename `"recording.webm"`.
 * The browser will automatically set the `Content-Type` of the part to the
 * blob's own MIME type (`audio/webm`) when the request is sent.
 *
 * Requirements: 2.1, 2.2
 */
export function buildFormData(blob: Blob): FormData {
    const form = new FormData();
    form.append('audio', blob, 'recording.webm');
    return form;
}

/**
 * Maps a caught error value to a user-facing string message.
 *
 * - `NotAllowedError` → microphone permission denied message
 * - `NotFoundError`   → no microphone found message
 * - Any other `Error` → the error's own message
 * - Non-Error values  → generic fallback message
 *
 * Requirements: 1.5, 4.1, 4.2
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
