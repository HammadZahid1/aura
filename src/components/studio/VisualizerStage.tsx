import type { RefObject } from 'react';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { getMode } from '../../data/visualizers';
import type { AudioEngine } from '../../lib/audio/AudioEngine';
import { cn } from '../../lib/utilities/cn';
import type { AudioPlayerApi } from '../../hooks/useAudioPlayer';
import { VisualizerCanvas } from '../visualizers/VisualizerCanvas';
import { ModeSwitcher } from './ModeSwitcher';
import { FullscreenOverlay } from './FullscreenOverlay';
import type { AudioSnapshot, PlaybackStatus, VisualizerConfig, VisualizationMode } from '../../types';

interface VisualizerStageProps {
  config: VisualizerConfig;
  status: PlaybackStatus;
  engineReady: boolean;
  engine: AudioEngine;
  stageRef: RefObject<HTMLElement | null>;
  isFullscreen: boolean;
  player: AudioPlayerApi;
  trackName: string;
  hasTrack: boolean;
  onFrame?: (snapshot: AudioSnapshot) => void;
  onModeChange: (mode: VisualizationMode) => void;
  onReset: () => void;
  onFullscreen: () => void;
}

export function VisualizerStage({
  config,
  status,
  engineReady,
  engine,
  stageRef,
  isFullscreen,
  player,
  trackName,
  hasTrack,
  onFrame,
  onModeChange,
  onReset,
  onFullscreen,
}: VisualizerStageProps) {
  const mode = getMode(config.mode);
  const active = status === 'playing';

  return (
    <section
      ref={stageRef}
      className={cn('panel panel-solid studio-stage', isFullscreen && 'is-fullscreen')}
      aria-labelledby="stage-title"
    >
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
          <button className="icon-button" onClick={onReset} aria-label="Reset visualization" title="Reset view">
            <RotateCcw size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button
            className="icon-button"
            onClick={onFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? (
              <Minimize2 size={16} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Maximize2 size={16} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="stage-modes">
        <ModeSwitcher mode={config.mode} onChange={onModeChange} />
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

      {isFullscreen && (
        <FullscreenOverlay
          player={player}
          trackName={trackName}
          hasTrack={hasTrack}
          onExit={onFullscreen}
        />
      )}
    </section>
  );
}
