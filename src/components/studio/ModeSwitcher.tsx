import { AudioWaveform, BarChart3, CircleDot, Orbit, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MODES } from '../../data/visualizers';
import { cn } from '../../lib/utilities/cn';
import type { VisualizationMode } from '../../types';

interface ModeSwitcherProps {
  mode: VisualizationMode;
  onChange: (mode: VisualizationMode) => void;
}

const ICONS: Record<string, LucideIcon> = {
  ring: CircleDot,
  wave: AudioWaveform,
  spectrum: BarChart3,
  particles: Sparkles,
  orbital: Orbit,
};

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switcher" role="group" aria-label="Visualization mode">
      {MODES.map((item, index) => {
        const Icon = ICONS[item.icon];
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            className={cn('mode-button', active && 'is-active')}
            aria-pressed={active}
            title={`${item.label} (${index + 1}) — ${item.description}`}
            onClick={() => onChange(item.id)}
          >
            <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
            <span>{item.label}</span>
            <span className="mono mode-key">{index + 1}</span>
          </button>
        );
      })}
    </div>
  );
}
