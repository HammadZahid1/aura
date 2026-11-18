import { BAND_RANGES } from './audioConfig';

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
