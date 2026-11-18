import { registerRenderer } from '../renderer';
import { frequencyAt, idleEnergy } from '../shared';
import { mix, rgba } from '../color';
import { clamp } from '../../utilities/cn';

registerRenderer('aura-ring', ({ ctx, width, height, frame, config, theme, time }) => {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.26;
  const glow = clamp(config.glow, 0, 2);
  const bass = frame.active ? frame.bands.bass : idleEnergy(time, 0);
  const overall = frame.active ? frame.bands.overall : idleEnergy(time, 3);

  ctx.save();
  ctx.lineCap = 'round';

  // Centre bloom follows low-frequency energy.
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = Math.min(0.5, (0.1 + bass * 0.35) * glow);
  ctx.fillStyle = theme.primary;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * (0.7 + bass * 0.5), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // Reference ring.
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = rgba(theme.primary, 0.14);
  ctx.lineWidth = 1;
  ctx.stroke();

  const bars = Math.max(12, Math.min(160, Math.round(config.barCount)));
  const rotation = time * 0.05 * config.speed;

  for (let index = 0; index < bars; index += 1) {
    const position = index / bars;
    const angle = position * Math.PI * 2 - Math.PI / 2 + rotation;
    // A gentle curve gives low frequencies more of the circle, like a log scale.
    const spectrumPosition = Math.pow(position, 1.5);
    const value = frame.active
      ? frequencyAt(frame, spectrumPosition, config.sensitivity)
      : idleEnergy(time, index);

    const inner = radius * 1.04;
    const length = radius * (0.06 + value * 0.92);
    const color = index % 11 === 0 ? theme.accent : mix(theme.primary, theme.secondary, position);

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
    ctx.lineTo(cx + Math.cos(angle) * (inner + length), cy + Math.sin(angle) * (inner + length));
    ctx.strokeStyle = rgba(color, 0.3 + value * 0.65);
    ctx.lineWidth = 1.6 + value * 1.1;
    ctx.stroke();
  }

  // Orbiting nodes react to overall activity rather than random movement.
  const nodes = 18;
  for (let index = 0; index < nodes; index += 1) {
    const angle = (index / nodes) * Math.PI * 2 - time * 0.11;
    const distance = radius * (1.55 + overall * 0.35 + (index % 3) * 0.09);
    const x = cx + Math.cos(angle) * distance;
    const y = cy + Math.sin(angle) * distance;
    const size = 1 + (index % 4 === 0 ? overall * 2.2 : overall);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = rgba(index % 5 === 0 ? theme.accent : theme.secondary, 0.25 + overall * 0.6);
    ctx.fill();
  }

  // Core rings.
  ctx.beginPath();
  ctx.arc(cx, cy, radius * (0.34 + bass * 0.1), 0, Math.PI * 2);
  ctx.strokeStyle = rgba(theme.primary, 0.32);
  ctx.lineWidth = 1 + bass * 2;
  ctx.stroke();

  ctx.shadowBlur = 22 * glow;
  ctx.shadowColor = theme.primary;
  ctx.beginPath();
  ctx.arc(cx, cy, 3 + bass * 5, 0, Math.PI * 2);
  ctx.fillStyle = theme.primary;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
});
