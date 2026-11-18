import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { AudioEngine } from '../lib/audio/AudioEngine';

export interface AudioEngineApi {
  engine: AudioEngine;
  isReady: boolean;
}

/** Creates one engine per studio session and activates it after playback starts. */
export function useAudioEngine(audioRef: RefObject<HTMLAudioElement | null>, active: boolean): AudioEngineApi {
  const engineRef = useRef<AudioEngine | null>(null);
  const [isReady, setReady] = useState(false);

  if (!engineRef.current) engineRef.current = new AudioEngine();
  const engine = engineRef.current;

  useEffect(() => {
    if (audioRef.current) engine.attach(audioRef.current);
    return () => {
      engine.detach();
      setReady(false);
    };
  }, [audioRef, engine]);

  useEffect(() => {
    if (!active) {
      setReady(false);
      return;
    }
    let cancelled = false;
    void engine.activate().then((ready) => {
      if (!cancelled) setReady(ready);
    });
    return () => { cancelled = true; };
  }, [active, engine]);

  return { engine, isReady };
}
