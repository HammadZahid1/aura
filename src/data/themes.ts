import type { ThemeDefinition, ThemeName } from '../types';

export const THEMES: Record<ThemeName, ThemeDefinition> = {
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan',
    description: 'Signature AURA palette. Cold, precise and luminous.',
    primary: '#43DDF5',
    secondary: '#4285FF',
    accent: '#9A78FF',
    background: '#050608',
    glow: 'rgba(67, 221, 245, 0.55)',
  },
  violet: {
    id: 'violet',
    name: 'Violet Dream',
    description: 'Soft spectral violets with a cyan edge.',
    primary: '#B693FF',
    secondary: '#7A5CFF',
    accent: '#43DDF5',
    background: '#07060C',
    glow: 'rgba(154, 120, 255, 0.55)',
  },
  blue: {
    id: 'blue',
    name: 'Deep Blue',
    description: 'Focused, monochromatic blue with quiet highlights.',
    primary: '#5B9DFF',
    secondary: '#2E5BD8',
    accent: '#8FC5FF',
    background: '#04070D',
    glow: 'rgba(66, 133, 255, 0.5)',
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    description: 'Cyan, mint and violet shifting like a night sky.',
    primary: '#43DDF5',
    secondary: '#5CF0B8',
    accent: '#B693FF',
    background: '#04090A',
    glow: 'rgba(92, 240, 184, 0.45)',
  },
  mono: {
    id: 'mono',
    name: 'Monochrome',
    description: 'Pure white light on near-black. Nothing else.',
    primary: '#F5F7FA',
    secondary: '#A9B2C0',
    accent: '#D5DEE9',
    background: '#050608',
    glow: 'rgba(245, 247, 250, 0.32)',
  },
};

export const THEME_LIST: ThemeDefinition[] = Object.values(THEMES);
