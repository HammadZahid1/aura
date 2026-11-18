/** Shared Web Audio configuration. Exported so analysis and tests use identical values. */
export const FFT_SIZE = 2048;
export const SMOOTHING_TIME_CONSTANT = 0.82;
export const MIN_DECIBELS = -90;
export const MAX_DECIBELS = -10;

/** Frequency band edges in Hz. Values are relative activity bands, not calibrated measurements. */
export const BAND_RANGES = {
  bass: { from: 20, to: 250 },
  mid: { from: 250, to: 2000 },
  treble: { from: 2000, to: 12000 },
} as const;
