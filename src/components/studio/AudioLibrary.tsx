import { AlertCircle, FileAudio2, Trash2, Upload, X } from 'lucide-react';
import { UploadZone } from './UploadZone';
import { formatBytes, formatTime } from '../../lib/audio/formatTime';
import { describeAudioType } from '../../lib/audio/fileValidation';
import type { AudioTrack } from '../../types';

interface AudioLibraryProps {
  track: AudioTrack | null;
  error: string | null;
  onFile: (file: File) => void;
  onRemove: () => void;
  onDismissError: () => void;
}

export function AudioLibrary({ track, error, onFile, onRemove, onDismissError }: AudioLibraryProps) {
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
        {error && (
          <div className="upload-error" role="alert">
            <AlertCircle size={15} strokeWidth={1.8} aria-hidden="true" />
            <span>{error}</span>
            <button className="icon-button" onClick={onDismissError} aria-label="Dismiss error">
              <X size={14} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
        )}
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

            <dl className="metadata-grid">
              <div>
                <dt>Format</dt>
                <dd className="mono">{describeAudioType(track.name, track.type)}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd className="mono">{track.duration > 0 ? formatTime(track.duration) : '—'}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd className="mono">{formatBytes(track.size)}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd className="mono">Local file</dd>
              </div>
            </dl>

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
