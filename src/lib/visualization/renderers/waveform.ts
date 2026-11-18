import { registerRenderer } from '../renderer';
import { clamp } from '../../utilities/cn';
import { rgba } from '../color';

registerRenderer('waveform', ({ ctx, width, height, frame, config, theme, time }) => {
  const samples = frame.waveform;
  const count = samples.length;
  const centreY = height / 2;
  const amplitude = height * 0.3 * clamp(config.sensitivity, 0.25, 3);
  const thickness = clamp(config.waveThickness, 0.5, 8);
  const glow = clamp(config.glow, 0, 2);
  const step = Math.max(1, Math.floor(count / Math.max(240, Math.floor(width))));

  const sampleAt = (index: number): number => {
    if (!frame.active || count === 0) {
      // Decorative idle line, never presented as audio input.
      const envelope = Math.sin((index / Math.max(1, count)) * Math.PI);
      return (
        Math.sin(index * 0.045 + time * 1.4) * 0.16 +
        Math.sin(index * 0.013 - time * 0.8) * 0.09
      ) * envelope;
    }
    return ((samples[index] - 128) / 128) * clamp(config.sensitivity, 0.25, 3);
  };

  // Soft mirrored area gives the signal depth without a heavy gradient fill.
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rgba(theme.primary, 0.05 * glow);
  ctx.beginPath();
  ctx.moveTo(0, centreY);
  for (let index = 0; index < count; index += step) {
    ctx.lineTo((index / (count - 1)) * width, centreY + sampleAt(index) * amplitude);
  }
  ctx.lineTo(width, centreY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Ghost traces are the same signal, slightly offset in time.
  for (let trace = 2; trace >= 1; trace -= 1) {
    ctx.beginPath();
    for (let index = 0; index < count; index += step) {
      const x = (index / (count - 1)) * width;
      const y = centreY + sampleAt(Math.min(count - 1, index + trace * 9)) * amplitude * (1 - trace * 0.18);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgba(trace === 2 ? theme.accent : theme.secondary, 0.16);
    ctx.lineWidth = thickness * 0.6;
    ctx.stroke();
  }

  // Primary signal line.
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowBlur = 12 * glow;
  ctx.shadowColor = theme.primary;
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  for (let index = 0; index < count; index += step) {
    const x = (index / (count - 1)) * width;
    const y = centreY + sampleAt(index) * amplitude;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Reference grid lines keep the stage feeling like an instrument.
  ctx.save();
  ctx.strokeStyle = rgba(theme.primary, 0.07);
  ctx.lineWidth = 1;
  for (let line = 1; line <= 3; line += 1) {
    const y = centreY + (line - 2) * amplitude * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
});
