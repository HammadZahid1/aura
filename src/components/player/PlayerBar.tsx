import { Pause, Play, Volume2 } from 'lucide-react';

export function PlayerBar() {
  return (
    <section className="panel panel-solid studio-player" aria-label="Audio player">
      <div className="player-main">
        <button className="btn btn-icon btn-primary" aria-label="Play" disabled>
          <Play size={16} fill="currentColor" strokeWidth={1.4} aria-hidden="true" />
        </button>
        <button className="btn btn-icon" aria-label="Pause" disabled>
          <Pause size={15} fill="currentColor" strokeWidth={1.4} aria-hidden="true" />
        </button>
        <span className="mono player-time">0:00</span>
        <div className="player-progress">
          <div className="player-progress-track">
            <span className="player-progress-fill" style={{ width: '0%' }} />
          </div>
        </div>
        <span className="mono player-time">0:00</span>
        <Volume2 size={16} strokeWidth={1.7} aria-hidden="true" />
        <div className="player-volume">
          <div className="player-progress-track">
            <span className="player-progress-fill" style={{ width: '70%' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
