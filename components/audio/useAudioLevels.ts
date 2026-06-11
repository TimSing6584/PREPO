"use client";

import { useEffect, useRef } from "react";

const BAR_COUNT = 32;

function getAudioContextClass(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  return window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

/**
 * Drives a canvas waveform from a live microphone stream using AnalyserNode.
 * Returns a ref to attach to a <canvas>; levels are painted each animation frame
 * without triggering React re-renders.
 */
export function useAudioLevels(stream: MediaStream | null) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!stream || !canvas) return;

    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.75;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const smoothed = new Float32Array(BAR_COUNT);
    let frameId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      analyser.getByteFrequencyData(frequencyData);

      const binCount = frequencyData.length;
      const gap = 3;
      const barWidth = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      const centerY = height / 2;

      for (let i = 0; i < BAR_COUNT; i++) {
        const binIndex = Math.floor((i / BAR_COUNT) ** 1.4 * (binCount - 1));
        const normalized = frequencyData[binIndex] / 255;
        const target = Math.max(0.08, normalized ** 0.85);
        smoothed[i] += (target - smoothed[i]) * 0.35;

        const barHeight = smoothed[i] * (height * 0.88);
        const x = i * (barWidth + gap);
        const radius = Math.min(barWidth / 2, 3);

        const gradient = ctx.createLinearGradient(x, centerY - barHeight / 2, x, centerY + barHeight / 2);
        gradient.addColorStop(0, "rgba(248, 113, 113, 0.95)");
        gradient.addColorStop(0.5, "rgba(239, 68, 68, 1)");
        gradient.addColorStop(1, "rgba(220, 38, 38, 0.9)");

        ctx.fillStyle = gradient;
        roundRect(ctx, x, centerY - barHeight / 2, barWidth, barHeight, radius);
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      source.disconnect();
      analyser.disconnect();
      void audioContext.close();
    };
  }, [stream]);

  return canvasRef;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
