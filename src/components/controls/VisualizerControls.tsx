import { SlidersHorizontal } from 'lucide-react';
import { ControlSlider } from '../ui/ControlSlider';
import type { VisualizerConfig } from '../../types';

interface VisualizerControlsProps {
  config: VisualizerConfig;
  onChange: (patch: Partial<VisualizerConfig>) => void;
}

export function VisualizerControls({ config, onChange }: VisualizerControlsProps) {
  return (
    <section className="panel panel-solid studio-controls" aria-labelledby="controls-title">
      <div className="panel-header">
        <h2 className="panel-title" id="controls-title">
          <SlidersHorizontal size={14} strokeWidth={1.8} aria-hidden="true" />
          Visualization Controls
        </h2>
        <span className="label">Tune</span>
      </div>
      <div className="controls-body">
        <ControlSlider
          label="Sensitivity"
          value={config.sensitivity}
          min={0.4}
          max={2.5}
          step={0.05}
          display={`${config.sensitivity.toFixed(2)}×`}
          hint="How strongly the visuals respond to the signal."
          onChange={(sensitivity) => onChange({ sensitivity })}
        />
        <div className="controls-note">
          <span className="chip-dot" />
          Changes are applied to the canvas immediately.
        </div>
      </div>
    </section>
  );
}
