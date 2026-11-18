import { useMemo, useState } from 'react';
import { AudioLibrary } from '../../components/studio/AudioLibrary';
import { VisualizerStage } from '../../components/studio/VisualizerStage';
import { AudioInsights } from '../../components/insights/AudioInsights';
import { PlayerBar } from '../../components/player/PlayerBar';
import { DEFAULT_CONFIG } from '../../data/visualizers';
import type { PlaybackStatus, VisualizerConfig } from '../../types';

export default function Studio() {
  const [config] = useState<VisualizerConfig>(DEFAULT_CONFIG);
  const [status] = useState<PlaybackStatus>('empty');
  const statusLabel = useMemo(() => status.toUpperCase(), [status]);

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
        <AudioLibrary />
        <VisualizerStage config={config} />
        <AudioInsights />
        <PlayerBar />
      </div>
    </div>
  );
}
