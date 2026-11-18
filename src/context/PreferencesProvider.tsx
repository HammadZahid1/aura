import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_CONFIG } from '../data/visualizers';
import { normalizeConfig } from '../lib/config/visualizerConfig';
import type { VisualizerConfig } from '../types';
import { PreferencesContext, type StudioPreferences } from './preferencesContext';

const STORAGE_KEY = 'aura.preferences';

function withoutTheme(config: VisualizerConfig): StudioPreferences {
  return {
    mode: config.mode,
    sensitivity: config.sensitivity,
    speed: config.speed,
    barCount: config.barCount,
    particleDensity: config.particleDensity,
    waveThickness: config.waveThickness,
    backgroundBrightness: config.backgroundBrightness,
    glow: config.glow,
  };
}

function readStoredPreferences(): StudioPreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return withoutTheme(normalizeConfig(JSON.parse(raw) as Partial<VisualizerConfig>));
  } catch {
    // Storage may be unavailable or contain invalid JSON; defaults remain valid.
  }
  return withoutTheme(DEFAULT_CONFIG);
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<StudioPreferences>(readStoredPreferences);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Persisting interface preferences is optional.
    }
  }, [preferences]);

  const updatePreferences = (patch: Partial<StudioPreferences>) => {
    setPreferences((current) => withoutTheme(normalizeConfig({ ...current, ...patch })));
  };

  const resetPreferences = () => {
    setPreferences(withoutTheme(DEFAULT_CONFIG));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}
