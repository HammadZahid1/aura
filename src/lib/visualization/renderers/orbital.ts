import { registerRenderer } from '../renderer';
import { frequencyAt, idleEnergy } from '../shared';
import { rgba } from '../color';
import { clamp } from '../../utilities/cn';

registerRenderer('orbital', ({ ctx, width, height, frame, config, theme, time }) => {
  const cx = width / 2;
  const cy = height / 2;
  const base = Math.min(width, height) * 0.16;
  const glow = clamp(config.glow, 0, 2);
  const segments = clamp(Math.round(config.barCount / 2), 12, 64);

  const bands = [
    { energy: frame.active ? frame.bands.bass : idleEnergy(time, 0), color: theme.primary, radius: base, direction: 1, tilt: 0.12 },
    { energy: frame.active ? frame.bands.mid : idleEnergy(time, 4), color: theme.secondary, radius: base * 1.55, direction: -1, tilt: -0.22 },
    { energy: frame.active ? frame.bands.treble : idleEnergy(time, 9), color: theme.accent, radius: base * 2.1, direction: 1, tilt: 0.3 },
  ];

  ctx.save();

  for (let orbit = 0; orbit < bands.length; orbit += 1) {
    const band = bands[orbit];
    const radius = band.radius * (1 + band.energy * 0.32);
    const rotation = time * 0.22 * band.direction;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(band.tilt + rotation * 0.15);

    // Orbit track.
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * (0.62 + orbit * 0.08), 0, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(band.color, 0.16 + band.energy * 0.3);
    ctx.lineWidth = 1 + band.energy * 2;
    ctx.stroke();

    // Frequency segments along the orbit.
    for (let index = 0; index < segments; index += 1) {
      const position = index / segments;
      const angle = position * Math.PI * 2;
      const value = frame.active
        ? frequencyAt(frame, Math.pow(position, 1.3) * (orbit === 0 ? 0.4 : orbit === 1 ? 0.7 : 1), config.sensitivity)
        : idleEnergy(time, index + orbit * 7);
      const jitter = value * radius * 0.18;
      const x = Math.cos(angle) * (radius + jitter);
      const y = Math.sin(angle) * (radius * (0.62 + orbit * 0.08) + jitter * 0.6);
      ctx.beginPath();
      ctx.arc(x, y, 0.8 + value * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = rgba(band.color, 0.25 + value * 0.6);
      ctx.fill();
    }

    // A brighter travelling body marks the band's activity.
    const bodyAngle = rotation;
    const bodyX = Math.cos(bodyAngle) * radius;
    const bodyY = Math.sin(bodyAngle) * radius * (0.62 + orbit * 0.08);
    ctx.shadowBlur = 16 * glow;
    ctx.shadowColor = band.color;
    ctx.beginPath();
    ctx.arc(bodyX, bodyY, 3 + band.energy * 6, 0, Math.PI * 2);
    ctx.fillStyle = band.color;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Centre pulse.
  const pulse = bands[0].energy;
  ctx.beginPath();
  ctx.arc(cx, cy, base * (0.24 + pulse * 0.2), 0, Math.PI * 2);
  ctx.fillStyle = rgba(theme.primary, 0.08 + pulse * 0.22);
  ctx.fill();
  ctx.restore();
});
