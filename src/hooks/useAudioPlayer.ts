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
  const [isLoading, setLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
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
      setLoading(false);
      setStatus('empty');
      return;
    }

    element.src = src;
    element.load();
    setDuration(0);
    setCurrentTime(0);
    setPlaying(false);
    setLoading(true);
    setStatus('loading');
  }, [src]);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;
    element.volume = volume;
    element.muted = muted;
  }, [volume, muted]);

  const handleVolumeChange = useCallback(() => {
    const element = audioRef.current;
    if (!element) return;
    setVolumeState(element.volume);
    setMuted(element.muted);
  }, []);

  const changeVolume = useCallback((value: number) => {
    const element = audioRef.current;
    const next = Math.max(0, Math.min(1, value));
    setVolumeState(next);
    if (element) {
      element.volume = next;
      element.muted = false;
    }
    setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const element = audioRef.current;
    const next = !muted;
    setMuted(next);
    if (element) element.muted = next;
  }, [muted]);

  const handleLoadedMetadata = useCallback(() => {
    const value = audioRef.current?.duration;
    const safeDuration = Number.isFinite(value) ? (value as number) : 0;
    setDuration(safeDuration);
    setLoading(false);
    setStatus('ready');
    onMetadata?.(safeDuration);
  }, [onMetadata]);

  const handleDurationChange = useCallback(() => {
    const value = audioRef.current?.duration;
    if (Number.isFinite(value)) setDuration(value as number);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const element = audioRef.current;
    if (element) setCurrentTime(element.currentTime);
  }, []);

  const handleSeeked = useCallback(() => {
    const element = audioRef.current;
    if (element) {
      setCurrentTime(element.currentTime);
      setLoading(false);
    }
  }, []);

  const handleWaiting = useCallback(() => setLoading(true), []);
  const handlePlaying = useCallback(() => setLoading(false), []);

  const handlePlay = useCallback(() => {
    setPlaying(true);
    setLoading(false);
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
    const limit = Number.isFinite(element.duration) ? element.duration : 0;
    const target = Math.max(0, Math.min(seconds, limit));
    element.currentTime = target;
    setCurrentTime(target);
  }, []);

  return {
    audioRef,
    duration,
    currentTime,
    isPlaying,
    isLoading,
    volume,
    muted,
    status,
    setStatus,
    toggle,
    seek,
    changeVolume,
    toggleMute,
    handleVolumeChange,
    handleLoadedMetadata,
    handleDurationChange,
    handleTimeUpdate,
    handleSeeked,
    handleWaiting,
    handlePlaying,
    handlePlay,
    handlePause,
    handleEnded,
  };
}

export type AudioPlayerApi = ReturnType<typeof useAudioPlayer>;
