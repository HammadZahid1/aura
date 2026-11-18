import { applySensitivity } from '../audio/sensitivity';
import type { AudioFrame, ThemeDefinition } from '../../types';

/** Draw the stage base with theme-aware, low-intensity ambient light. */
export function drawStageBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: ThemeDefinition,
  brightness: number,
) {
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);

  const intensity = Math.max(0, Math.min(1, brightness)) * 0.16;
  if (intensity <= 0) return;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = theme.primary;
  ctx.globalAlpha = intensity * 0.45;
  ctx.beginPath();
  ctx.arc(width * 0.5, height * 0.5, Math.min(width, height) * 0.46, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = theme.accent;
  ctx.globalAlpha = intensity * 0.2;
  ctx.beginPath();
  ctx.arc(width * 0.76, height * 0.2, Math.min(width, height) * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Read one normalised frequency sample by relative position (0..1) in the spectrum. */
export function frequencyAt(frame: AudioFrame, position: number, sensitivity: number): number {
  const bins = frame.frequency.length;
  if (bins === 0) return 0;
  const index = Math.min(bins - 1, Math.max(0, Math.floor(position * bins)));
  return applySensitivity(frame.frequency[index] / 255, sensitivity);
}

/** Deterministic low-amplitude motion used only when no audio is active. */
export function idleEnergy(time: number, index: number): number {
  return 0.055 + 0.035 * (Math.sin(time * 0.9 + index * 0.31) * 0.5 + 0.5);
}

/** Smoothly interpolate towards a target. Frame-rate independent enough for visual use. */
export function approach(current: number, target: number, amount: number): number {
  return current + (target - current) * Math.min(1, Math.max(0, amount));
}
