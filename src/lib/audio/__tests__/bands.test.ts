import { describe, expect, it } from 'vitest';
import { BAND_RANGES, FFT_SIZE } from '../audioConfig';
import {
  bandEnergy,
  calculateBands,
  calculateBassActivity,
  calculateMidActivity,
  calculateOverallActivity,
  calculateTrebleActivity,
} from '../bands';

const SAMPLE_RATE = 44100;
const BIN_COUNT = FFT_SIZE / 2;

function filledRange(fromHz: number, toHz: number): Uint8Array {
  const values = new Uint8Array(BIN_COUNT);
  const hzPerBin = SAMPLE_RATE / FFT_SIZE;
  const start = Math.floor(fromHz / hzPerBin);
  const end = Math.min(BIN_COUNT, Math.ceil(toHz / hzPerBin));
  values.fill(255, start, end);
  return values;
}

describe('bandEnergy', () => {
  it('returns zero for an empty spectrum', () => {
    expect(bandEnergy(new Uint8Array(0), 20, 250, SAMPLE_RATE, FFT_SIZE)).toBe(0);
  });

  it('averages only the requested frequency range', () => {
    const values = filledRange(BAND_RANGES.bass.from, BAND_RANGES.bass.to);
    expect(calculateBassActivity(values, SAMPLE_RATE, FFT_SIZE)).toBeCloseTo(1, 5);
    expect(calculateTrebleActivity(values, SAMPLE_RATE, FFT_SIZE)).toBeLessThan(0.02);
  });
});

describe('activity calculators', () => {
  it('reports silence as zero across every band', () => {
    const silence = new Uint8Array(BIN_COUNT);
    expect(calculateBands(silence, SAMPLE_RATE, FFT_SIZE)).toEqual({
      bass: 0,
      mid: 0,
      treble: 0,
      overall: 0,
    });
    expect(calculateOverallActivity(silence)).toBe(0);
  });

  it('detects mid-frequency energy without inflating bass', () => {
    const values = filledRange(BAND_RANGES.mid.from, BAND_RANGES.mid.to);
    expect(calculateMidActivity(values, SAMPLE_RATE, FFT_SIZE)).toBeGreaterThan(0.9);
    expect(calculateBassActivity(values, SAMPLE_RATE, FFT_SIZE)).toBeLessThan(0.1);
    expect(calculateOverallActivity(values)).toBeGreaterThan(0);
  });

  it('normalises overall activity by spectrum length', () => {
    const values = new Uint8Array(BIN_COUNT);
    values.fill(128);
    expect(calculateOverallActivity(values)).toBeCloseTo(128 / 255, 5);
  });
});
