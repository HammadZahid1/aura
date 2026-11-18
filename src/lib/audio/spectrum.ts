/** Number of visual bars used by the studio insights spectrum. */
export const INSIGHT_SPECTRUM_BARS = 28;

/**
 * Reduce the analyser's frequency bins to a fixed number of display bars.
 *
 * Each bar contains the average magnitude of one contiguous slice of the
 * frequency buffer. Empty input produces silent bars so the UI can render a
 * stable idle state before playback starts.
 */
export function sampleFrequencySpectrum(
  frequency: Uint8Array,
  bins: number = INSIGHT_SPECTRUM_BARS,
): number[] {
  if (bins <= 0) return [];
  if (frequency.length === 0) return Array.from({ length: bins }, () => 0);

  const bars = new Array<number>(bins);
  // Most musical energy sits well below the top of the analyser range.
  const usableBins = Math.min(frequency.length, 512);

  for (let index = 0; index < bins; index += 1) {
    const start = Math.floor((index / bins) * usableBins);
    const end = Math.max(start + 1, Math.floor(((index + 1) / bins) * usableBins));
    let sum = 0;

    for (let bin = start; bin < end; bin += 1) {
      sum += frequency[bin];
    }

    bars[index] = Math.round(sum / (end - start));
  }

  return bars;
}
