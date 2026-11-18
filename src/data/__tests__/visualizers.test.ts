import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, getMode, MODE_IDS, MODES } from '../visualizers';

describe('visualizer metadata', () => {
  it('defines a unique id for every mode', () => {
    expect(MODE_IDS).toHaveLength(MODES.length);
    expect(new Set(MODE_IDS).size).toBe(MODES.length);
  });

  it('uses a valid default mode', () => {
    expect(MODE_IDS).toContain(DEFAULT_CONFIG.mode);
  });

  it('returns the requested mode', () => {
    MODES.forEach((mode) => expect(getMode(mode.id)).toBe(mode));
  });

  it('falls back to the first mode for an unknown id', () => {
    expect(getMode('unknown' as never)).toBe(MODES[0]);
  });
});
