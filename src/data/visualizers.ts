import type { VisualizerConfig, VisualizationMode } from '../types';

export interface ModeDefinition {
  id: VisualizationMode;
  label: string;
  description: string;
  detail: string;
  icon: 'ring' | 'wave' | 'spectrum' | 'particles' | 'orbital';
}

export const MODES: ModeDefinition[] = [
  {
    id: 'aura-ring',
    label: 'Aura Ring',
    description: 'A circular spectrum that breathes with your audio.',
    detail: 'Radial frequency bars, centre glow and drifting particles.',
    icon: 'ring',
  },
  {
    id: 'waveform',
    label: 'Waveform',
    description: 'The raw shape of sound, drawn in real time.',
    detail: 'Time-domain samples rendered as a continuous signal line.',
    icon: 'wave',
  },
  {
    id: 'spectrum',
    label: 'Spectrum',
    description: 'Every frequency laid out across the stage.',
    detail: 'Bass, mid and treble energy with smooth decay.',
    icon: 'spectrum',
  },
  {
    id: 'particles',
    label: 'Particle Field',
    description: 'Sound made physical. A field of responding light.',
    detail: 'Density and velocity driven by measured audio energy.',
    icon: 'particles',
  },
  {
    id: 'orbital',
    label: 'Orbital',
    description: 'Concentric rings moving through a frequency orbit.',
    detail: 'Layered circular orbits responding to separate bands.',
    icon: 'orbital',
  },
];

export const DEFAULT_CONFIG: VisualizerConfig = {
  mode: 'aura-ring',
  sensitivity: 1,
  speed: 1,
  barCount: 72,
  particleDensity: 160,
  waveThickness: 2,
  backgroundBrightness: 0.35,
  glow: 1,
  theme: 'cyan',
};

export const MODE_IDS: VisualizationMode[] = MODES.map((mode) => mode.id);

export function getMode(id: VisualizationMode): ModeDefinition {
  return MODES.find((mode) => mode.id === id) ?? MODES[0];
}
