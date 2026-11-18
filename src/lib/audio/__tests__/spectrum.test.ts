import { describe, expect, it } from 'vitest';
import { INSIGHT_SPECTRUM_BARS, sampleFrequencySpectrum } from '../spectrum';

describe('sampleFrequencySpectrum', () => {
  it('produces a stable silent spectrum before analysis starts', () => {
    expect(sampleFrequencySpectrum(new Uint8Array(0))).toEqual(
      Array.from({ length: INSIGHT_SPECTRUM_BARS }, () => 0),
    );
  });

  it('returns the requested number of bars', () => {
    expect(sampleFrequencySpectrum(new Uint8Array(512), 8)).toHaveLength(8);
    expect(sampleFrequencySpectrum(new Uint8Array(512), 0)).toEqual([]);
  });

  it('averages each contiguous slice of the frequency buffer', () => {
    const values = new Uint8Array(8);
    values.fill(200, 0, 4);
    values.fill(100, 4, 8);
    expect(sampleFrequencySpectrum(values, 2)).toEqual([200, 100]);
  });

  it('handles buffers shorter than the requested bar count', () => {
    const values = new Uint8Array([255, 0]);
    const result = sampleFrequencySpectrum(values, 4);
    expect(result).toHaveLength(4);
    expect(result.every((value) => value >= 0 && value <= 255)).toBe(true);
  });
});
