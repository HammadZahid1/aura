import { Minimize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../../lib/audio/formatTime';
import type { AudioPlayerApi } from '../../hooks/useAudioPlayer';

interface FullscreenOverlayProps {
  player: AudioPlayerApi;
  trackName: string;
  hasTrack: boolean;
  onExit: () => void;
}

export function FullscreenOverlay({ player, trackName, hasTrack, onExit }: FullscreenOverlayProps) {
  const { duration, currentTime, isPlaying, volume, muted } = player;
  const disabled = !hasTrack || duration <= 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fullscreen-overlay">
      <div className="fullscreen-overlay__head">
        <div>
          <span className="label">Now visualizing</span>
          <strong>{trackName || 'No track loaded'}</strong>
        </div>
        <span className="fullscreen-hint">Press Esc to exit</span>
        <button type="button" className="icon-button" onClick={onExit} aria-label="Exit fullscreen">
          <Minimize2 size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      <div className="fullscreen-transport">
        <button
          type="button"
          className="btn btn-icon btn-primary"
          onClick={() => void player.toggle()}
          disabled={disabled}
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? (
            <Pause size={15} fill="currentColor" strokeWidth={1.4} aria-hidden="true" />
          ) : (
            <Play size={15} fill="currentColor" strokeWidth={1.4} aria-hidden="true" />
          )}
        </button>
        <span className="mono fullscreen-time">{formatTime(currentTime)}</span>
        <input
          className="player-seek"
          type="range"
          min={0}
          max={duration || 1}
          step={0.01}
          value={Math.min(currentTime, duration || 1)}
          disabled={disabled}
          aria-label="Seek audio"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          style={{ '--range-fill': `${progress}%` } as React.CSSProperties}
          onChange={(event) => player.seek(Number(event.target.value))}
        />
        <span className="mono fullscreen-time">{formatTime(duration)}</span>
        <button
          type="button"
          className="icon-button"
          onClick={player.toggleMute}
          disabled={!hasTrack}
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        >
          {muted || volume === 0 ? (
            <VolumeX size={16} strokeWidth={1.7} aria-hidden="true" />
          ) : (
            <Volume2 size={16} strokeWidth={1.7} aria-hidden="true" />
          )}
        </button>
        <input
          className="player-volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          disabled={!hasTrack}
          aria-label="Volume"
          style={{ '--range-fill': `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
          onChange={(event) => player.changeVolume(Number(event.target.value))}
        />
      </div>
    </div>
  );
}
