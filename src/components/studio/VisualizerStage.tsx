import { Maximize2, RotateCcw } from 'lucide-react';
import { getMode } from '../../data/visualizers';
import type { AudioEngine } from '../../lib/audio/AudioEngine';
import { VisualizerCanvas } from '../visualizers/VisualizerCanvas';
import type { FrequencyBands, PlaybackStatus, VisualizerConfig } from '../../types';

interface VisualizerStageProps {
  config: VisualizerConfig;
  status: PlaybackStatus;
  engineReady: boolean;
  engine: AudioEngine;
  onFrame?: (bands: FrequencyBands, level: number) => void;
}

export function VisualizerStage({ config, status, engineReady, engine, onFrame }: VisualizerStageProps) {
  const mode = getMode(config.mode);
  const active = status === 'playing';

  return (
    <section className="panel panel-solid studio-stage" aria-labelledby="stage-title">
      <div className="stage-header">
        <div>
          <span className="label" title={`AudioContext: ${engine.contextState}`}>
            Output / {mode.label}
          </span>
          <h2 className="panel-title" id="stage-title">
            Visualization Stage
          </h2>
        </div>
        <div className="stage-actions">
          <button className="icon-button" aria-label="Reset view" disabled title="Reset view">
            <RotateCcw size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button className="icon-button" aria-label="Enter fullscreen" disabled title="Fullscreen">
            <Maximize2 size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="stage-canvas-wrap">
        <VisualizerCanvas engine={engine} config={config} active={active} onFrame={onFrame} />
      </div>
      <div className="stage-footer">
        <span className="chip">
          <span className="chip-dot" />
          {active ? 'Live signal' : status}
        </span>
        <span className="mono stage-hint">
          {engineReady ? 'Analysis graph connected' : 'Load audio to activate the visualizer'}
        </span>
      </div>
    </section>
  );
}
