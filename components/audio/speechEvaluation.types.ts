export interface SpeechEvaluation {
  transcript: string;
  score: number;
  feedback: string;
}

export interface PipelineSuccessResponse extends SpeechEvaluation {}

export interface PipelineErrorResponse {
  detail: string;
}

export type PipelineResponse = PipelineSuccessResponse | PipelineErrorResponse;

export function isPipelineSuccess(
  r: PipelineResponse,
): r is PipelineSuccessResponse {
  return "transcript" in r && "score" in r && "feedback" in r;
}

export function buildPipelineFormData(
  blob: Blob,
  statement: string,
  modelAnswer: string,
): FormData {
  const form = new FormData();
  form.append("audio", blob, "recording.webm");
  form.append("statement", statement);
  form.append("model_answer", modelAnswer);
  return form;
}

export function formatScore(score: number): string {
  if (score <= 1) return `${Math.round(score * 100)}%`;
  return `${Math.round(score)}%`;
}

export function scoreColorClass(score: number): string {
  const normalized = score <= 1 ? score * 100 : score;
  if (normalized >= 70) return "text-emerald-600";
  if (normalized >= 40) return "text-amber-600";
  return "text-red-600";
}
