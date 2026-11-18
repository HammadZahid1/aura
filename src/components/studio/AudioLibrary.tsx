import { Music2 } from 'lucide-react';

export function AudioLibrary() {
  return (
    <section className="panel panel-solid studio-library" aria-labelledby="library-title">
      <div className="panel-header">
        <h2 className="panel-title" id="library-title">
          <Music2 size={14} strokeWidth={1.8} aria-hidden="true" />
          Audio Library
        </h2>
        <span className="label">Local</span>
      </div>
      <div className="panel-body library-body">
        <div className="library-empty">
          <span className="library-empty-icon">
            <Music2 size={22} strokeWidth={1.4} aria-hidden="true" />
          </span>
          <p>No audio loaded</p>
          <span>Upload a track to begin the session.</span>
        </div>
      </div>
    </section>
  );
}
