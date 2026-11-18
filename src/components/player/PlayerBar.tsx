import { AlertCircle, LoaderCircle, Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { formatTime } from '../../lib/audio/formatTime';
import type { AudioPlayerApi } from '../../hooks/useAudioPlayer';

interface PlayerBarProps {
  player: AudioPlayerApi;
  hasTrack: boolean;
}

export function PlayerBar({ player, hasTrack }: PlayerBarProps) {
  const { duration, currentTime, isPlaying, isLoading, volume, muted, error, status, toggle, seek, retry, clearError, changeVolume, toggleMute } = player;
  const disabled = !hasTrack || duration <= 0;
  const loading = isLoading || status === 'loading';
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="panel panel-solid studio-player" aria-label="Audio player">
      {error && (
        <div className="player-error" role="alert">
          <AlertCircle size={15} strokeWidth={1.8} aria-hidden="true" />
          <span>{error}</span>
          <button className="btn btn-accent player-retry" onClick={() => void retry()}>
            Retry
          </button>
          <button className="icon-button" onClick={clearError} aria-label="Dismiss playback error">
            <X size={14} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="player-main">
        <button
          className="btn btn-icon btn-primary player-play"
          onClick={() => void toggle()}
          disabled={disabled || loading}
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {loading ? (
            <LoaderCircle size={16} className="spin" aria-hidden="true" />
          ) : isPlaying ? (
            <Pause size={15} fill="currentColor" strokeWidth={1.4} aria-hidden="true" />
          ) : (
            <Play size={15} fill="currentColor" strokeWidth={1.4} aria-hidden="true" />
          )}
        </button>

        <button
          className="icon-button"
          onClick={() => seek(0)}
          disabled={disabled}
          aria-label="Restart audio"
          title="Restart"
        >
          <RotateCcw size={15} strokeWidth={1.7} aria-hidden="true" />
        </button>

        <span className="mono player-time">{formatTime(currentTime)}</span>

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
          onChange={(event) => seek(Number(event.target.value))}
        />

        <span className="mono player-time player-duration">{formatTime(duration)}</span>

        <div className="player-volume-group">
          <button
            className="icon-button"
            onClick={toggleMute}
            disabled={!hasTrack}
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
            title={muted ? 'Unmute' : 'Mute'}
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
            onChange={(event) => changeVolume(Number(event.target.value))}
          />
        </div>
      </div>
    </section>
  );
}
