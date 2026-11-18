import { describe, expect, it } from 'vitest';
import { applySensitivity } from '../sensitivity';

describe('applySensitivity', () => {
  it('keeps silence silent and full scale at full scale', () => {
    expect(applySensitivity(0, 1)).toBe(0);
    expect(applySensitivity(1, 1)).toBe(1);
  });

  it('increases quiet values as sensitivity rises', () => {
    const quiet = 0.2;
    expect(applySensitivity(quiet, 0.5)).toBeLessThan(applySensitivity(quiet, 1));
    expect(applySensitivity(quiet, 1)).toBeLessThan(applySensitivity(quiet, 2));
  });

  it('clamps out-of-range inputs', () => {
    expect(applySensitivity(-1, 99)).toBe(0);
    expect(applySensitivity(2, -99)).toBeGreaterThanOrEqual(0);
    expect(applySensitivity(1, 99)).toBeLessThanOrEqual(1);
  });

  it('always returns a finite value between zero and one', () => {
    [0, 0.25, 0.75, 1].forEach((value) => {
      const result = applySensitivity(value, 1.4);
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });
});
