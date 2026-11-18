import { registerRenderer } from '../renderer';
import { approach, frequencyAt, idleEnergy } from '../shared';
import { mix, rgba } from '../color';
import { clamp } from '../../utilities/cn';

const MAX_BARS = 160;
const smoothed = new Float32Array(MAX_BARS);

registerRenderer('spectrum', ({ ctx, width, height, frame, config, theme, time }) => {
  const bars = Math.max(16, Math.min(MAX_BARS, Math.round(config.barCount)));
  const gap = clamp(width / bars * 0.18, 1, 7);
  const barWidth = Math.max(1, (width - gap * (bars - 1)) / bars);
  const baseline = height * 0.88;
  const maxHeight = height * 0.68;
  const glow = clamp(config.glow, 0, 2);

  ctx.save();

  // Band regions, drawn subtly behind the bars.
  const regions = [
    { from: 0, to: 0.2, color: theme.primary, label: 'BASS' },
    { from: 0.2, to: 0.62, color: theme.secondary, label: 'MID' },
    { from: 0.62, to: 1, color: theme.accent, label: 'TREBLE' },
  ];
  for (const region of regions) {
    const x = region.from * width;
    const regionWidth = (region.to - region.from) * width;
    ctx.fillStyle = rgba(region.color, 0.025);
    ctx.fillRect(x, 0, regionWidth, baseline);
    ctx.font = '9px "IBM Plex Mono", monospace';
    ctx.fillStyle = rgba(region.color, 0.45);
    ctx.fillText(region.label, x + 10, 22);
    ctx.strokeStyle = rgba(region.color, 0.09);
    ctx.beginPath();
    ctx.moveTo(x, 28);
    ctx.lineTo(x, baseline);
    ctx.stroke();
  }

  ctx.strokeStyle = rgba(theme.primary, 0.14);
  ctx.beginPath();
  ctx.moveTo(0, baseline + 0.5);
  ctx.lineTo(width, baseline + 0.5);
  ctx.stroke();

  for (let index = 0; index < bars; index += 1) {
    const position = index / (bars - 1);
    const target = frame.active
      ? frequencyAt(frame, Math.pow(position, 1.35), config.sensitivity)
      : idleEnergy(time, index);
    smoothed[index] = approach(smoothed[index], target, frame.active ? 0.38 : 0.1);

    const value = smoothed[index];
    const barHeight = Math.max(2, value * maxHeight);
    const x = index * (barWidth + gap);
    const color = position < 0.2 ? theme.primary : position < 0.62 ? mix(theme.primary, theme.secondary, 0.7) : theme.accent;

    ctx.fillStyle = rgba(color, 0.32 + value * 0.62);
    ctx.fillRect(x, baseline - barHeight, barWidth, barHeight);
    ctx.fillStyle = rgba(color, Math.min(1, 0.4 + value * 0.6) * glow);
    ctx.fillRect(x, baseline - barHeight, barWidth, 2);
  }

  ctx.restore();
});
