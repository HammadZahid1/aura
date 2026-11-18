import { useEffect, useRef } from 'react';
import { THEMES } from '../../data/themes';
import { resizeCanvas } from '../../lib/visualization/canvas';
import { drawStageBackground } from '../../lib/visualization/shared';
import { getRenderer, type RenderParams } from '../../lib/visualization/renderer';
import '../../lib/visualization/renderers';
import type { AudioEngine } from '../../lib/audio/AudioEngine';
import type { FrequencyBands, VisualizerConfig } from '../../types';

interface VisualizerCanvasProps {
  engine: AudioEngine;
  config: VisualizerConfig;
  active: boolean;
  onFrame?: (bands: FrequencyBands, level: number) => void;
}

export function VisualizerCanvas({ engine, config, active, onFrame }: VisualizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef(config);
  const activeRef = useRef(active);
  const onFrameRef = useRef(onFrame);

  configRef.current = config;
  activeRef.current = active;
  onFrameRef.current = onFrame;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    let size = resizeCanvas(canvas, ctx);
    const params: RenderParams = {
      ctx,
      width: size.width,
      height: size.height,
      frame: engine.readFrame(false),
      config: configRef.current,
      theme: THEMES[configRef.current.theme],
      time: 0,
    };

    const observer = new ResizeObserver(() => {
      size = resizeCanvas(canvas, ctx);
    });
    observer.observe(canvas);

    let animation = 0;
    let lastInsight = 0;

    const render = (timestamp: number) => {
      if (!document.hidden) {
        params.width = size.width;
        params.height = size.height;
        params.config = configRef.current;
        params.theme = THEMES[configRef.current.theme];
        params.time = (timestamp / 1000) * configRef.current.speed;
        params.frame = engine.readFrame(activeRef.current);

        drawStageBackground(ctx, size.width, size.height, params.theme, configRef.current.backgroundBrightness);
        getRenderer(params.config.mode)(params);

        const callback = onFrameRef.current;
        if (callback && timestamp - lastInsight > 110) {
          callback(params.frame.bands, params.frame.level);
          lastInsight = timestamp;
        }
      }
      animation = window.requestAnimationFrame(render);
    };

    animation = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animation);
      observer.disconnect();
    };
  }, [engine]);

  return <canvas ref={canvasRef} className="visualizer-canvas" aria-hidden="true" />;
}
