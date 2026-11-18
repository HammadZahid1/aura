import { registerRenderer } from '../renderer';
import { clamp } from '../../utilities/cn';
import { rgba } from '../color';

const MAX_PARTICLES = 400;
const positionsX = new Float32Array(MAX_PARTICLES);
const positionsY = new Float32Array(MAX_PARTICLES);
const velocityX = new Float32Array(MAX_PARTICLES);
const velocityY = new Float32Array(MAX_PARTICLES);
const depths = new Float32Array(MAX_PARTICLES);
let initialised = false;

function random(index: number, salt: number): number {
  const value = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function seedParticles(width: number, height: number) {
  for (let index = 0; index < MAX_PARTICLES; index += 1) {
    positionsX[index] = random(index, 1) * width;
    positionsY[index] = random(index, 2) * height;
    velocityX[index] = (random(index, 3) - 0.5) * 0.3;
    velocityY[index] = (random(index, 4) - 0.5) * 0.3;
    depths[index] = 0.3 + random(index, 5) * 0.7;
  }
  initialised = true;
}

registerRenderer('particles', ({ ctx, width, height, frame, config, theme, time }) => {
  if (!initialised || positionsX[0] > width || positionsY[0] > height) {
    seedParticles(width, height);
  }

  const count = Math.max(40, Math.min(MAX_PARTICLES, Math.round(config.particleDensity)));
  const cx = width / 2;
  const cy = height / 2;
  const bass = frame.active ? frame.bands.bass : 0;
  const mid = frame.active ? frame.bands.mid : 0;
  const treble = frame.active ? frame.bands.treble : 0;
  const overall = frame.active ? frame.bands.overall : 0.03;
  const speed = clamp(config.speed, 0.2, 2);

  ctx.save();
  ctx.fillStyle = rgba(theme.primary, 0.05 * clamp(config.glow, 0, 2));
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(width, height) * (0.1 + bass * 0.22), 0, Math.PI * 2);
  ctx.fill();

  for (let index = 0; index < count; index += 1) {
    const dx = positionsX[index] - cx;
    const dy = positionsY[index] - cy;
    const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const depth = depths[index];

    // Audio bands determine motion: bass repels, mid swirls, treble adds fine tremor.
    const push = frame.active ? (bass * 0.45 + overall * 0.2) * depth : 0;
    const swirl = frame.active ? mid * 0.35 * depth : 0;
    const tremor = frame.active ? treble * 0.25 : 0;

    velocityX[index] += ((dx / distance) * push + (-dy / distance) * swirl) * 0.04 * speed;
    velocityY[index] += ((dy / distance) * push + (dx / distance) * swirl) * 0.04 * speed;
    velocityX[index] += Math.sin(time * 2 + index) * tremor * 0.02;
    velocityY[index] += Math.cos(time * 1.7 + index) * tremor * 0.02;

    velocityX[index] *= frame.active ? 0.965 : 0.99;
    velocityY[index] *= frame.active ? 0.965 : 0.99;

    positionsX[index] += velocityX[index] * speed + (frame.active ? 0 : Math.sin(time + index) * 0.02);
    positionsY[index] += velocityY[index] * speed + (frame.active ? 0 : Math.cos(time + index) * 0.02);

    if (positionsX[index] < 0) positionsX[index] += width;
    if (positionsX[index] > width) positionsX[index] -= width;
    if (positionsY[index] < 0) positionsY[index] += height;
    if (positionsY[index] > height) positionsY[index] -= height;

    const radius = (0.6 + depth * 1.5) * (1 + bass * 0.8);
    const color = index % 7 === 0 ? theme.accent : index % 3 === 0 ? theme.secondary : theme.primary;
    const alpha = (0.16 + depth * 0.34 + overall * 0.45) * clamp(config.glow, 0.2, 2);

    ctx.beginPath();
    ctx.arc(positionsX[index], positionsY[index], radius, 0, Math.PI * 2);
    ctx.fillStyle = rgba(color, Math.min(1, alpha));
    ctx.fill();
  }

  ctx.restore();
});
