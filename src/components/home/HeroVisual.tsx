import { useEffect, useRef } from 'react';
import { resizeCanvas } from '../../lib/visualization/canvas';
import { drawIdleScene } from '../../lib/visualization/idleScene';
import { THEMES } from '../../data/themes';

/** Decorative, audio-free idle visualization for the landing hero. */
export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    const palette = THEMES.cyan;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let size = resizeCanvas(canvas, ctx);

    const draw = (timestamp: number) => {
      drawIdleScene(ctx, size.width, size.height, timestamp / 1000, palette);
      if (!reduced) frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(() => {
      size = resizeCanvas(canvas, ctx);
      if (reduced) drawIdleScene(ctx, size.width, size.height, 0, palette);
    });
    observer.observe(canvas);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="hero-visual">
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        role="img"
        aria-label="Decorative idle audio visualization. No audio is playing."
      />
    </div>
  );
}
