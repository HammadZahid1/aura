/** AURA's shared domain types. Kept framework-agnostic so audio and rendering code stays reusable. */

export type Route = '/' | '/studio' | '/gallery' | '/settings' | '/about';

export type VisualizationMode = 'aura-ring' | 'waveform' | 'spectrum' | 'particles' | 'orbital';

export type ThemeName = 'cyan' | 'violet' | 'blue' | 'aurora' | 'mono';

export interface ThemeDefinition {
  id: ThemeName;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  glow: string;
}

export interface FrequencyBands {
  bass: number;
  mid: number;
  treble: number;
  overall: number;
}

/** A frame of analysis data produced by the Web Audio engine. Arrays are reused between frames. */
export interface AudioFrame {
  frequency: Uint8Array;
  waveform: Uint8Array;
  bands: FrequencyBands;
  level: number;
  active: boolean;
}

export interface VisualizerConfig {
  mode: VisualizationMode;
  sensitivity: number;
  speed: number;
  barCount: number;
  particleDensity: number;
  waveThickness: number;
  backgroundBrightness: number;
  glow: number;
  theme: ThemeName;
}

export interface AudioTrack {
  name: string;
  size: number;
  type: string;
  duration: number;
  url: string;
}

export type PlaybackStatus = 'empty' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileLike {
  name: string;
  type: string;
  size: number;
}
