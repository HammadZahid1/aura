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
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [status, setStatus] = useState<PlaybackStatus>(src ? 'loading' : 'empty');

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;

    if (!src) {
      element.removeAttribute('src');
      element.load();
      setDuration(0);
      setCurrentTime(0);
      setPlaying(false);
      setStatus('empty');
      return;
    }

    element.src = src;
    element.load();
    setDuration(0);
    setCurrentTime(0);
    setPlaying(false);
    setStatus('loading');
  }, [src]);

  const handleLoadedMetadata = useCallback(() => {
    const value = audioRef.current?.duration;
    const safeDuration = Number.isFinite(value) ? value as number : 0;
    setDuration(safeDuration);
    setStatus('ready');
    onMetadata?.(safeDuration);
  }, [onMetadata]);

  const handleTimeUpdate = useCallback(() => {
    const element = audioRef.current;
    if (element) setCurrentTime(element.currentTime);
  }, []);

  const handlePlay = useCallback(() => {
    setPlaying(true);
    setStatus('playing');
  }, []);

  const handlePause = useCallback(() => {
    setPlaying(false);
    setStatus((current) => (current === 'ended' ? current : 'paused'));
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setStatus('ended');
  }, []);

  const toggle = useCallback(async () => {
    const element = audioRef.current;
    if (!element || !src) return;
    if (!element.paused) {
      element.pause();
      return;
    }
    try {
      await element.play();
    } catch {
      setStatus('error');
    }
  }, [src]);

  const seek = useCallback((seconds: number) => {
    const element = audioRef.current;
    if (!element || !Number.isFinite(seconds)) return;
    const target = Math.max(0, Math.min(seconds, Number.isFinite(element.duration) ? element.duration : 0));
    element.currentTime = target;
    setCurrentTime(target);
  }, []);

  return {
    audioRef,
    duration,
    currentTime,
    isPlaying,
    status,
    setStatus,
    toggle,
    seek,
    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
  };
}

export type AudioPlayerApi = ReturnType<typeof useAudioPlayer>;
