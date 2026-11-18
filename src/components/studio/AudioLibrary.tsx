import { FileAudio2, Trash2, Upload } from 'lucide-react';
import { UploadZone } from './UploadZone';
import { formatBytes } from '../../lib/audio/formatTime';
import type { AudioTrack } from '../../types';

interface AudioLibraryProps {
  track: AudioTrack | null;
  onFile: (file: File) => void;
  onRemove: () => void;
}

export function AudioLibrary({ track, onFile, onRemove }: AudioLibraryProps) {
  return (
    <section className="panel panel-solid studio-library" aria-labelledby="library-title">
      <div className="panel-header">
        <h2 className="panel-title" id="library-title">
          <FileAudio2 size={14} strokeWidth={1.8} aria-hidden="true" />
          Audio Library
        </h2>
        <span className="label">Local</span>
      </div>
      <div className="panel-body library-body">
        {track ? (
          <div className="library-loaded">
            <div className="loaded-file">
              <span className="loaded-file-icon">
                <FileAudio2 size={18} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div className="loaded-file-info">
                <strong title={track.name}>{track.name}</strong>
                <span className="mono">{formatBytes(track.size)}</span>
              </div>
            </div>
            <div className="loaded-actions">
              <label className="btn btn-accent replace-button">
                <Upload size={14} strokeWidth={1.8} aria-hidden="true" />
                Replace audio
                <input
                  className="visually-hidden"
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.opus,.webm"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onFile(file);
                    event.target.value = '';
                  }}
                />
              </label>
              <button className="icon-button" onClick={onRemove} aria-label="Remove audio" title="Remove audio">
                <Trash2 size={15} strokeWidth={1.7} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <UploadZone onFile={onFile} />
        )}
        <div className="library-privacy">
          <span className="chip-dot" />
          Files never leave this device
        </div>
      </div>
    </section>
  );
}
