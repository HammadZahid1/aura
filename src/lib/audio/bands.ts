import { BAND_RANGES } from './audioConfig';
import type { FrequencyBands } from '../../types';

/** Average normalised energy of the frequency bins covering a given Hz range. */
export function bandEnergy(
  frequency: Uint8Array,
  fromHz: number,
  toHz: number,
  sampleRate: number,
  fftSize: number,
): number {
  if (frequency.length === 0) return 0;

  const hzPerBin = sampleRate / fftSize;
  const lastIndex = frequency.length - 1;
  const start = Math.min(lastIndex, Math.max(0, Math.floor(fromHz / hzPerBin)));
  const end = Math.min(frequency.length, Math.max(start + 1, Math.ceil(toHz / hzPerBin)));

  let sum = 0;
  for (let index = start; index < end; index += 1) sum += frequency[index];
  return sum / ((end - start) * 255);
}

/** Relative bass activity (20–250 Hz). Not a calibrated audio measurement. */
export function calculateBassActivity(frequency: Uint8Array, sampleRate: number, fftSize: number): number {
  return bandEnergy(frequency, BAND_RANGES.bass.from, BAND_RANGES.bass.to, sampleRate, fftSize);
}

/** Relative mid-frequency activity (250–2000 Hz). */
export function calculateMidActivity(frequency: Uint8Array, sampleRate: number, fftSize: number): number {
  return bandEnergy(frequency, BAND_RANGES.mid.from, BAND_RANGES.mid.to, sampleRate, fftSize);
}

/** Relative treble activity (2000–12000 Hz). */
export function calculateTrebleActivity(frequency: Uint8Array, sampleRate: number, fftSize: number): number {
  return bandEnergy(frequency, BAND_RANGES.treble.from, BAND_RANGES.treble.to, sampleRate, fftSize);
}

/** Overall relative activity across the whole spectrum. */
export function calculateOverallActivity(frequency: Uint8Array): number {
  if (frequency.length === 0) return 0;
  let sum = 0;
  for (let index = 0; index < frequency.length; index += 1) sum += frequency[index];
  return sum / (frequency.length * 255);
}

/** Calculate all relative activity bands from one frequency frame. */
export function calculateBands(frequency: Uint8Array, sampleRate: number, fftSize: number): FrequencyBands {
  return {
    bass: calculateBassActivity(frequency, sampleRate, fftSize),
    mid: calculateMidActivity(frequency, sampleRate, fftSize),
    treble: calculateTrebleActivity(frequency, sampleRate, fftSize),
    overall: calculateOverallActivity(frequency),
  };
}
