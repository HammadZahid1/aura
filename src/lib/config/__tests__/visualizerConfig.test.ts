import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '../../../data/visualizers';
import { normalizeConfig, SETTING_RANGES } from '../visualizerConfig';
import type { ThemeName, VisualizationMode } from '../../../types';

describe('normalizeConfig', () => {
  it('returns the full default config for empty input', () => {
    expect(normalizeConfig()).toEqual(DEFAULT_CONFIG);
  });

  it('merges valid partial input with defaults', () => {
    const result = normalizeConfig({ mode: 'waveform', sensitivity: 1.5 });
    expect(result.mode).toBe('waveform');
    expect(result.sensitivity).toBe(1.5);
    expect(result.barCount).toBe(DEFAULT_CONFIG.barCount);
    expect(result.theme).toBe(DEFAULT_CONFIG.theme);
  });

  it('discards invalid modes and themes', () => {
    const result = normalizeConfig({
      mode: 'unknown' as VisualizationMode,
      theme: 'unknown' as ThemeName,
    });
    expect(result.mode).toBe(DEFAULT_CONFIG.mode);
    expect(result.theme).toBe(DEFAULT_CONFIG.theme);
  });

  it('clamps numeric settings to their declared ranges', () => {
    const result = normalizeConfig({
      sensitivity: 99,
      speed: -3,
      barCount: Number.NaN,
      particleDensity: 1000,
      waveThickness: 0,
      backgroundBrightness: 4,
      glow: -1,
    });

    expect(result.sensitivity).toBe(SETTING_RANGES.sensitivity.max);
    expect(result.speed).toBe(SETTING_RANGES.speed.min);
    expect(result.barCount).toBe(DEFAULT_CONFIG.barCount);
    expect(result.particleDensity).toBe(SETTING_RANGES.particleDensity.max);
    expect(result.waveThickness).toBe(SETTING_RANGES.waveThickness.min);
    expect(result.backgroundBrightness).toBe(SETTING_RANGES.backgroundBrightness.max);
    expect(result.glow).toBe(SETTING_RANGES.glow.min);
  });

  it('snaps values to the configured step', () => {
    expect(normalizeConfig({ sensitivity: 1.13 }).sensitivity).toBe(1.15);
    expect(normalizeConfig({ barCount: 30 }).barCount).toBe(30);
  });

  it('does not mutate its input', () => {
    const input = { mode: 'spectrum' as const, sensitivity: 0.5 };
    normalizeConfig(input);
    expect(input).toEqual({ mode: 'spectrum', sensitivity: 0.5 });
  });
});
