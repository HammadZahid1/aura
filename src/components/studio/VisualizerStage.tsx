import { Maximize2, RotateCcw } from 'lucide-react';
import { getMode } from '../../data/visualizers';
import type { AudioEngine } from '../../lib/audio/AudioEngine';
import type { PlaybackStatus, VisualizerConfig } from '../../types';

interface VisualizerStageProps {
  config: VisualizerConfig;
  status: PlaybackStatus;
  engineReady: boolean;
  engine: AudioEngine;
}

export function VisualizerStage({ config, status, engineReady, engine }: VisualizerStageProps) {
  const mode = getMode(config.mode);

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
        <div className="stage-placeholder" role="img" aria-label="Visualization stage, waiting for audio">
          <span className="stage-placeholder-ring" />
          <span className="stage-placeholder-ring stage-placeholder-ring-2" />
          <span className="stage-placeholder-label mono">Awaiting signal</span>
        </div>
      </div>
      <div className="stage-footer">
        <span className="chip">
          <span className="chip-dot" />
          {status === 'playing' ? 'Live signal' : status}
        </span>
        <span className="mono stage-hint">
          {engineReady ? 'Analysis graph connected' : 'Load audio to activate the visualizer'}
        </span>
      </div>
    </section>
  );
}
