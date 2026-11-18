import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlaybackStatus } from '../types';

interface UseAudioPlayerOptions {
  src: string | null;
  onMetadata?: (duration: number) => void;
}

/** Owns the single persistent media element and keeps its source in sync with the loaded track. */
export function useAudioPlayer({ src, onMetadata }: UseAudioPlayerOptions) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>(src ? 'loading' : 'empty');

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;

    if (!src) {
      element.removeAttribute('src');
      element.load();
      setDuration(0);
      setStatus('empty');
      return;
    }

    element.src = src;
    element.load();
    setDuration(0);
    setStatus('loading');
  }, [src]);

  const handleLoadedMetadata = useCallback(() => {
    const value = audioRef.current?.duration;
    const safeDuration = Number.isFinite(value) ? value as number : 0;
    setDuration(safeDuration);
    setStatus('ready');
    onMetadata?.(safeDuration);
  }, [onMetadata]);

  return { audioRef, duration, status, setStatus, handleLoadedMetadata };
}
