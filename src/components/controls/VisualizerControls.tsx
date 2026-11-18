import { SlidersHorizontal } from 'lucide-react';
import { ControlSlider } from '../ui/ControlSlider';
import { ThemePicker } from './ThemePicker';
import type { VisualizerConfig } from '../../types';

interface VisualizerControlsProps {
  config: VisualizerConfig;
  onChange: (patch: Partial<VisualizerConfig>) => void;
}

export function VisualizerControls({ config, onChange }: VisualizerControlsProps) {
  const usesBars = config.mode === 'aura-ring' || config.mode === 'spectrum' || config.mode === 'orbital';
  const usesParticles = config.mode === 'particles';
  const usesWave = config.mode === 'waveform';

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
        <ControlSlider
          label="Animation speed"
          value={config.speed}
          min={0.2}
          max={2}
          step={0.05}
          display={`${config.speed.toFixed(2)}×`}
          hint="Motion tempo of the active visualizer."
          onChange={(speed) => onChange({ speed })}
        />
        {usesBars && (
          <ControlSlider
            label="Bar count"
            value={config.barCount}
            min={16}
            max={128}
            step={2}
            display={String(config.barCount)}
            hint="Number of frequency bars on the stage."
            onChange={(barCount) => onChange({ barCount })}
          />
        )}
        {usesParticles && (
          <ControlSlider
            label="Particle density"
            value={config.particleDensity}
            min={40}
            max={400}
            step={10}
            display={String(config.particleDensity)}
            hint="Number of particles in the field."
            onChange={(particleDensity) => onChange({ particleDensity })}
          />
        )}
        {usesWave && (
          <ControlSlider
            label="Wave thickness"
            value={config.waveThickness}
            min={1}
            max={6}
            step={0.5}
            display={`${config.waveThickness.toFixed(1)} px`}
            hint="Width of the signal line."
            onChange={(waveThickness) => onChange({ waveThickness })}
          />
        )}
        <ControlSlider
          label="Glow"
          value={config.glow}
          min={0}
          max={2}
          step={0.05}
          display={`${config.glow.toFixed(2)}×`}
          hint="Intensity of light around the visualization."
          onChange={(glow) => onChange({ glow })}
        />
        <ControlSlider
          label="Background"
          value={config.backgroundBrightness}
          min={0}
          max={1}
          step={0.05}
          display={`${Math.round(config.backgroundBrightness * 100)}%`}
          hint="Brightness of the ambient stage lighting."
          onChange={(backgroundBrightness) => onChange({ backgroundBrightness })}
        />
        <div className="controls-theme">
          <span className="label">Color theme</span>
          <ThemePicker />
        </div>
      </div>
    </section>
  );
}
