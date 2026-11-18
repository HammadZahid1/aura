import { createContext } from 'react';
import type { VisualizerConfig } from '../types';

export type StudioPreferences = Omit<VisualizerConfig, 'theme'>;

export interface PreferencesContextValue {
  preferences: StudioPreferences;
  updatePreferences: (patch: Partial<StudioPreferences>) => void;
  resetPreferences: () => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
