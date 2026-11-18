import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';

/** Small wrapper around the Fullscreen API with reactive state and safe fallbacks. */
export function useFullscreen(target: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === target.current);
    document.addEventListener('fullscreenchange', sync);
    sync();
    return () => document.removeEventListener('fullscreenchange', sync);
  }, [target]);

  const enter = useCallback(async () => {
    try {
      await target.current?.requestFullscreen?.();
    } catch {
      // Fullscreen can be blocked by the browser or unsupported; the stage still works inline.
    }
  }, [target]);

  const exit = useCallback(async () => {
    if (!document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
      // The browser may have already exited fullscreen.
    }
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement === target.current) void exit();
    else void enter();
  }, [target, enter, exit]);

  return { isFullscreen, enter, exit, toggle };
}
