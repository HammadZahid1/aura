import { useCallback, useEffect, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { AudioLibrary } from '../../components/studio/AudioLibrary';
import { VisualizerStage } from '../../components/studio/VisualizerStage';
import { AudioInsights } from '../../components/insights/AudioInsights';
import { VisualizerControls } from '../../components/controls/VisualizerControls';
import { PlayerBar } from '../../components/player/PlayerBar';
import { useAudioDrop } from '../../hooks/useAudioDrop';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useTheme } from '../../hooks/useTheme';
import { usePreferences } from '../../hooks/usePreferences';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useAudioEngine } from '../../hooks/useAudioEngine';
import { DEFAULT_CONFIG, MODE_IDS } from '../../data/visualizers';
import { validateAudioFile } from '../../lib/audio/fileValidation';
import { cn } from '../../lib/utilities/cn';
import { isInteractiveTarget } from '../../lib/utilities/keyboard';
import type { AudioSnapshot, AudioTrack, VisualizerConfig } from '../../types';

export default function Studio() {
  const { theme, setTheme } = useTheme();
  const { preferences, resetPreferences } = usePreferences();
  const [baseConfig, setBaseConfig] = useState<VisualizerConfig>(() => ({ ...preferences, theme }));
  const config: VisualizerConfig = { ...baseConfig, theme };

  const updateConfig = (patch: Partial<VisualizerConfig>) => {
    if (patch.theme) setTheme(patch.theme);
    setBaseConfig((current) => ({ ...current, ...patch }));
  };
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<AudioSnapshot | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const handleMetadata = useCallback((duration: number) => {
    setTrack((current) => (current ? { ...current, duration } : current));
  }, []);

  const player = useAudioPlayer({ src: track?.url ?? null, onMetadata: handleMetadata });
  const { toggle: togglePlayback } = player;
  const { engine, isReady: engineReady } = useAudioEngine(player.audioRef, player.isPlaying);
  const stageRef = useRef<HTMLElement>(null);
  const {
    isFullscreen,
    toggle: toggleFullscreen,
  } = useFullscreen(stageRef);

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  const handleFile = (file: File) => {
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setError(validation.error ?? 'This file cannot be used.');
      return;
    }

    setError(null);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setTrack({ name: file.name, size: file.size, type: file.type, duration: 0, url });
    setInsight(null);
  };

  const handleRemove = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setTrack(null);
    setError(null);
    setInsight(null);
  };

  const { isDragging, dropHandlers } = useAudioDrop(handleFile);

  const resetControls = useCallback(() => {
    resetPreferences();
    setTheme('cyan');
    setBaseConfig({ ...DEFAULT_CONFIG, theme: 'cyan' });
  }, [resetPreferences, setTheme]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (isInteractiveTarget(event.target)) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      const key = event.key.toLowerCase();
      if (key === 'f') {
        event.preventDefault();
        toggleFullscreen();
        return;
      }
      if (key === 'r') {
        event.preventDefault();
        resetControls();
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        void togglePlayback();
        return;
      }
      const index = Number(event.key) - 1;
      if (index >= 0 && index < MODE_IDS.length) {
        setBaseConfig((current) => ({ ...current, mode: MODE_IDS[index] }));
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [toggleFullscreen, resetControls, togglePlayback]);

  return (
    <div className="page studio-page container">
      <div className="studio-heading">
        <div>
          <span className="eyebrow">Workspace / 01</span>
          <h1 className="heading-lg studio-title">Audio Studio</h1>
        </div>
        <span className="chip">
          <span className="chip-dot" />
          {player.status.toUpperCase()}
        </span>
      </div>

      <div className={cn('studio-grid-wrap', isDragging && 'is-dragging')} {...dropHandlers}>
        <div className="studio-grid">
          <AudioLibrary
            track={track}
            error={error}
            onFile={handleFile}
            onRemove={handleRemove}
            onDismissError={() => setError(null)}
          />
          <VisualizerStage
            config={config}
            status={player.status}
            engineReady={engineReady}
            engine={engine}
            stageRef={stageRef}
            isFullscreen={isFullscreen}
            player={player}
            trackName={track?.name ?? ''}
            hasTrack={Boolean(track)}
            onFrame={setInsight}
            onModeChange={(mode) => updateConfig({ mode })}
            onReset={resetControls}
            onFullscreen={toggleFullscreen}
          />
          <AudioInsights status={player.status} snapshot={insight} theme={theme} />
          <VisualizerControls config={config} onChange={updateConfig} />
          <PlayerBar player={player} hasTrack={Boolean(track)} />
        </div>
        <div className="drop-overlay" aria-hidden={!isDragging}>
          <div className="drop-overlay-inner">
            <UploadCloud size={30} strokeWidth={1.4} aria-hidden="true" />
            <strong>Drop to load audio</strong>
            <span>Your file stays on this device</span>
          </div>
        </div>
      </div>

      <audio
        ref={player.audioRef}
        preload="metadata"
        onLoadedMetadata={player.handleLoadedMetadata}
        onDurationChange={player.handleDurationChange}
        onTimeUpdate={player.handleTimeUpdate}
        onSeeked={player.handleSeeked}
        onWaiting={player.handleWaiting}
        onPlaying={player.handlePlaying}
        onVolumeChange={player.handleVolumeChange}
        onPlay={player.handlePlay}
        onPause={player.handlePause}
        onEnded={player.handleEnded}
        onError={player.handleError}
        className="visually-hidden"
      />
    </div>
  );
}
