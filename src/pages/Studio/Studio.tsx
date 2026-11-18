import { useCallback, useEffect, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { AudioLibrary } from '../../components/studio/AudioLibrary';
import { VisualizerStage } from '../../components/studio/VisualizerStage';
import { AudioInsights } from '../../components/insights/AudioInsights';
import { PlayerBar } from '../../components/player/PlayerBar';
import { useAudioDrop } from '../../hooks/useAudioDrop';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useAudioEngine } from '../../hooks/useAudioEngine';
import { DEFAULT_CONFIG } from '../../data/visualizers';
import { validateAudioFile } from '../../lib/audio/fileValidation';
import { cn } from '../../lib/utilities/cn';
import type { AudioTrack, VisualizerConfig } from '../../types';

export default function Studio() {
  const [config] = useState<VisualizerConfig>(DEFAULT_CONFIG);
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const handleMetadata = useCallback((duration: number) => {
    setTrack((current) => (current ? { ...current, duration } : current));
  }, []);

  const player = useAudioPlayer({ src: track?.url ?? null, onMetadata: handleMetadata });
  const { engine, isReady: engineReady } = useAudioEngine(player.audioRef, player.isPlaying);

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
  };

  const handleRemove = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setTrack(null);
    setError(null);
  };

  const { isDragging, dropHandlers } = useAudioDrop(handleFile);

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
          />
          <AudioInsights status={player.status} />
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
