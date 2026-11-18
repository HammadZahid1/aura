import { useEffect, useMemo, useRef, useState } from 'react';
import { AudioLibrary } from '../../components/studio/AudioLibrary';
import { VisualizerStage } from '../../components/studio/VisualizerStage';
import { AudioInsights } from '../../components/insights/AudioInsights';
import { PlayerBar } from '../../components/player/PlayerBar';
import { DEFAULT_CONFIG } from '../../data/visualizers';
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

      <div className="studio-grid">
        <AudioLibrary track={track} onFile={handleFile} onRemove={handleRemove} />
        <VisualizerStage config={config} />
        <AudioInsights />
        <PlayerBar />
      </div>
    </div>
  );
}
