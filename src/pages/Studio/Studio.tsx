import { useEffect, useMemo, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { AudioLibrary } from '../../components/studio/AudioLibrary';
import { VisualizerStage } from '../../components/studio/VisualizerStage';
import { AudioInsights } from '../../components/insights/AudioInsights';
import { PlayerBar } from '../../components/player/PlayerBar';
import { useAudioDrop } from '../../hooks/useAudioDrop';
import { DEFAULT_CONFIG } from '../../data/visualizers';
import { cn } from '../../lib/utilities/cn';
import type { AudioTrack, PlaybackStatus, VisualizerConfig } from '../../types';

export default function Studio() {
  const [config] = useState<VisualizerConfig>(DEFAULT_CONFIG);
  const [status] = useState<PlaybackStatus>('empty');
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const statusLabel = useMemo(() => status.toUpperCase(), [status]);

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  const handleFile = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setTrack({ name: file.name, size: file.size, type: file.type, duration: 0, url });
  };

  const handleRemove = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setTrack(null);
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
          {statusLabel}
        </span>
      </div>

      <div className={cn('studio-grid-wrap', isDragging && 'is-dragging')} {...dropHandlers}>
        <div className="studio-grid">
          <AudioLibrary track={track} onFile={handleFile} onRemove={handleRemove} />
          <VisualizerStage config={config} />
          <AudioInsights />
          <PlayerBar />
        </div>
        <div className="drop-overlay" aria-hidden={!isDragging}>
          <div className="drop-overlay-inner">
            <UploadCloud size={30} strokeWidth={1.4} aria-hidden="true" />
            <strong>Drop to load audio</strong>
            <span>Your file stays on this device</span>
          </div>
        </div>
      </div>
    </div>
  );
}
