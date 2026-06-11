"use client";

import { useAudioLevels } from "./useAudioLevels";

interface RecordingWaveformProps {
  stream: MediaStream;
}

export default function RecordingWaveform({ stream }: RecordingWaveformProps) {
  const canvasRef = useAudioLevels(stream);

  return (
    <div
      className="relative h-16 w-full overflow-hidden rounded-xl bg-gradient-to-b from-red-50 to-white"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12),transparent_70%)]" />
      <canvas ref={canvasRef} className="relative block h-full w-full" />
    </div>
  );
}
