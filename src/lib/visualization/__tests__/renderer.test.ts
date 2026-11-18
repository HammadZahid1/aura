import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRenderer, placeholderRenderer, registerRenderer, type VisualizationRenderer } from '../renderer';

const originalWaveform = getRenderer('waveform');

afterEach(() => {
  registerRenderer('waveform', originalWaveform);
});

describe('renderer registry', () => {
  it('uses the placeholder for unregistered modes', () => {
    expect(getRenderer('aura-ring')).toBe(placeholderRenderer);
  });

  it('returns a newly registered renderer', () => {
    const renderer: VisualizationRenderer = vi.fn();
    registerRenderer('waveform', renderer);
    expect(getRenderer('waveform')).toBe(renderer);
  });

  it('lets a renderer replace an existing registration', () => {
    const first: VisualizationRenderer = vi.fn();
    const second: VisualizationRenderer = vi.fn();
    registerRenderer('waveform', first);
    registerRenderer('waveform', second);
    expect(getRenderer('waveform')).toBe(second);
  });
});
