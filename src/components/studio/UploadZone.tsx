import { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

const ACCEPT = 'audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.opus,.webm';

export function UploadZone({ onFile, disabled = false }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      className="upload-zone"
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Choose an audio file from your device"
      aria-disabled={disabled}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPicker();
        }
      }}
    >
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept={ACCEPT}
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = '';
        }}
      />
      <span className="upload-icon">
        <UploadCloud size={22} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <strong>Choose an audio file</strong>
      <span className="upload-copy">or drop it into the studio</span>
      <span className="upload-formats mono">MP3 · WAV · OGG · M4A · AAC · FLAC</span>
    </div>
  );
}
