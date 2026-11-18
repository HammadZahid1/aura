import { rgba } from './color';

interface IdlePalette {
  primary: string;
  secondary: string;
  accent: string;
}

const PARTICLE_COUNT = 46;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const seed = (offset: number) => {
    const value = Math.sin((index + 1) * 12.9898 + offset * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };
  return { angle: seed(1) * Math.PI * 2, radius: 0.32 + seed(2) * 0.62, size: 0.6 + seed(3) * 1.5, drift: 0.3 + seed(4) * 0.9 };
});

/**
 * Decorative idle composition for the landing hero.
 * This is intentionally generated from time-based geometry only — it never pretends to be audio input.
 */
export function drawIdleScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: IdlePalette,
) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.31;

  ctx.clearRect(0, 0, width, height);

  // Layered depth: faint field of drifting points.
  for (let i = 0; i < PARTICLES.length; i += 1) {
    const particle = PARTICLES[i];
    const angle = particle.angle + time * 0.045 * particle.drift;
    const distance = radius * (1.05 + particle.radius * 1.25);
    const x = cx + Math.cos(angle) * distance;
    const y = cy + Math.sin(angle) * distance * 0.82;
    const pulse = 0.35 + 0.25 * Math.sin(time * 1.1 + i);
    ctx.fillStyle = rgba(i % 3 === 0 ? palette.accent : palette.primary, pulse);
    ctx.beginPath();
    ctx.arc(x, y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Concentric reference rings.
  const rings = [radius * 0.52, radius * 0.78, radius * 1.06];
  for (let ring = 0; ring < rings.length; ring += 1) {
    ctx.beginPath();
    ctx.arc(cx, cy, rings[ring], 0, Math.PI * 2);
    ctx.strokeStyle = rgba(ring === 1 ? palette.secondary : palette.primary, ring === 1 ? 0.2 : 0.11);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Circular spectrum. Idle bars breathe gently instead of reacting to audio.
  const bars = 84;
  for (let i = 0; i < bars; i += 1) {
    const angle = (i / bars) * Math.PI * 2 - Math.PI / 2 + time * 0.035;
    const wave = 0.5 + 0.5 * Math.sin(i * 0.31 + time * 1.3) * Math.cos(i * 0.11 - time * 0.7);
    const length = radius * (0.1 + wave * 0.3);
    const inner = radius * 1.12;
    const color = i % 7 === 0 ? palette.accent : i % 3 === 0 ? palette.secondary : palette.primary;

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
    ctx.lineTo(cx + Math.cos(angle) * (inner + length), cy + Math.sin(angle) * (inner + length));
    ctx.strokeStyle = rgba(color, 0.22 + wave * 0.5);
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Rotating arc segments give the composition a sense of instrumentation.
  for (let arc = 0; arc < 3; arc += 1) {
    const start = time * (0.16 + arc * 0.07) + arc * 2.1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * (0.9 + arc * 0.12), start, start + 0.55 + arc * 0.18);
    ctx.strokeStyle = rgba(arc === 1 ? palette.secondary : palette.accent, 0.5);
    ctx.lineWidth = arc === 0 ? 2 : 1;
    ctx.stroke();
  }

  // Layered waveform lines drifting through the centre.
  for (let line = 0; line < 3; line += 1) {
    const lineWidth = width * (0.5 + line * 0.13);
    const amplitude = radius * (0.12 - line * 0.025);
    ctx.beginPath();
    for (let x = 0; x <= lineWidth; x += 3) {
      const px = cx - lineWidth / 2 + x;
      const phase = (x / lineWidth) * Math.PI * 6 + time * (0.9 + line * 0.35);
      const envelope = Math.sin((x / lineWidth) * Math.PI);
      const py = cy + Math.sin(phase) * amplitude * envelope;
      if (x === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = rgba(line === 0 ? palette.primary : palette.secondary, 0.28 - line * 0.06);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Glowing centre node.
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = rgba(palette.primary, 0.06);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 3 + Math.sin(time * 1.8) * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = palette.primary;
  ctx.shadowBlur = 18;
  ctx.shadowColor = palette.primary;
  ctx.fill();
  ctx.shadowBlur = 0;
}
