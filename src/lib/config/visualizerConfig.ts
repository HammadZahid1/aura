import { DEFAULT_CONFIG, MODE_IDS } from '../../data/visualizers';
import { THEMES } from '../../data/themes';
import type { ThemeName, VisualizerConfig, VisualizationMode } from '../../types';

export type VisualizerNumericSetting = Exclude<keyof VisualizerConfig, 'mode' | 'theme'>;

export interface SettingRange {
  min: number;
  max: number;
  step: number;
}

/** Single source of truth for control bounds, shared by the studio and settings pages. */
export const SETTING_RANGES: Record<VisualizerNumericSetting, SettingRange> = {
  sensitivity: { min: 0.4, max: 2.5, step: 0.05 },
  speed: { min: 0.2, max: 2, step: 0.05 },
  barCount: { min: 16, max: 128, step: 2 },
  particleDensity: { min: 40, max: 400, step: 10 },
  waveThickness: { min: 1, max: 6, step: 0.5 },
  backgroundBrightness: { min: 0, max: 1, step: 0.05 },
  glow: { min: 0, max: 2, step: 0.05 },
};

function clamp(value: number, range: SettingRange, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  const bounded = Math.min(range.max, Math.max(range.min, value));
  const stepped = Math.round((bounded - range.min) / range.step) * range.step + range.min;
  return Number(stepped.toFixed(4));
}

/**
 * Merge partial stored or user input with defaults, discarding invalid values.
 * This keeps localStorage preferences safe to load without a schema migration.
 */
export function normalizeConfig(input: Partial<VisualizerConfig> = {}): VisualizerConfig {
  const result: VisualizerConfig = { ...DEFAULT_CONFIG };
  const mode = input.mode as VisualizationMode | undefined;
  const theme = input.theme as ThemeName | undefined;

  if (mode && MODE_IDS.includes(mode)) result.mode = mode;
  if (theme && THEMES[theme]) result.theme = theme;

  (Object.keys(SETTING_RANGES) as VisualizerNumericSetting[]).forEach((key) => {
    const value = input[key];
    if (typeof value === 'number') result[key] = clamp(value, SETTING_RANGES[key], DEFAULT_CONFIG[key]);
  });

  return result;
}
