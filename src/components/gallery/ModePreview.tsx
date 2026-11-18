import { useEffect, useRef } from 'react';
import { THEMES } from '../../data/themes';
import { DEFAULT_CONFIG } from '../../data/visualizers';
import { drawStageBackground } from '../../lib/visualization/shared';
import { resizeCanvas } from '../../lib/visualization/canvas';
import { getRenderer, type RenderParams } from '../../lib/visualization/renderer';
import '../../lib/visualization/renderers';
import { normalizeConfig } from '../../lib/config/visualizerConfig';
import { useTheme } from '../../hooks/useTheme';
import type { AudioFrame, VisualizationMode, VisualizerConfig } from '../../types';

interface ModePreviewProps {
  mode: VisualizationMode;
  overrides?: Partial<VisualizerConfig>;
  className?: string;
}

const FREQUENCY_BINS = 512;
const WAVEFORM_SAMPLES = 1024;

/** Create a live-looking analysis frame from deterministic maths, never from user audio. */
function createPreviewFrame(): AudioFrame {
  return {
    frequency: new Uint8Array(FREQUENCY_BINS),
    waveform: new Uint8Array(WAVEFORM_SAMPLES),
    bands: { bass: 0, mid: 0, treble: 0, overall: 0 },
    level: 0,
    peak: 0,
    active: true,
  };
}

function updatePreviewFrame(frame: AudioFrame, time: number) {
  const { frequency, waveform } = frame;
  let bassSum = 0;
  let midSum = 0;
  let trebleSum = 0;

  for (let index = 0; index < frequency.length; index += 1) {
    const position = index / frequency.length;
    const envelope = Math.pow(1 - position, 1.6);
    const wave =
      Math.sin(time * 2.1 + position * 18) * 0.5 +
      Math.sin(time * 1.3 - position * 41) * 0.3 +
      Math.sin(time * 3.4 + position * 7) * 0.2;
    const value = Math.max(0, Math.min(255, (0.35 + wave * 0.35) * envelope * 255));
    frequency[index] = value;

    if (position < 0.16) bassSum += value;
    else if (position < 0.5) midSum += value;
    else trebleSum += value;
  }

  for (let index = 0; index < waveform.length; index += 1) {
    const position = index / waveform.length;
    const signal =
      Math.sin(position * Math.PI * 14 + time * 2.4) * 0.55 +
      Math.sin(position * Math.PI * 37 - time * 1.6) * 0.25 +
      Math.sin(position * Math.PI * 5 + time) * 0.2;
    waveform[index] = 128 + signal * 78;
  }

  const average = (sum: number, count: number) => (count > 0 ? sum / count / 255 : 0);
  frame.bands.bass = average(bassSum, Math.floor(frequency.length * 0.16));
  frame.bands.mid = average(midSum, Math.floor(frequency.length * 0.34));
  frame.bands.treble = average(trebleSum, Math.floor(frequency.length * 0.5));
  frame.bands.overall = (frame.bands.bass + frame.bands.mid + frame.bands.treble) / 3;
  frame.level = frame.bands.overall;
  frame.peak = Math.max(frame.level, frame.peak * 0.97);
}

export function ModePreview({ mode, overrides, className = '' }: ModePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const frame = createPreviewFrame();
    const config = normalizeConfig({ ...DEFAULT_CONFIG, ...overridesRef.current, mode, theme });
    let size = resizeCanvas(canvas, ctx);
    const params: RenderParams = {
      ctx,
      width: size.width,
      height: size.height,
      frame,
      config,
      theme: THEMES[theme],
      time: 0,
    };

    const draw = (timestamp: number) => {
      updatePreviewFrame(frame, timestamp / 1000 * config.speed);
      params.time = timestamp / 1000 * config.speed;
      drawStageBackground(ctx, size.width, size.height, params.theme, config.backgroundBrightness);
      getRenderer(mode)(params);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animation = 0;

    const observer = new ResizeObserver(() => {
      size = resizeCanvas(canvas, ctx);
      params.width = size.width;
      params.height = size.height;
      if (reduced) draw(0);
    });
    observer.observe(canvas);

    if (reduced) {
      draw(0);
    } else {
      const render = (timestamp: number) => {
        if (!document.hidden) draw(timestamp);
        animation = window.requestAnimationFrame(render);
      };
      animation = window.requestAnimationFrame(render);
    }

    return () => {
      window.cancelAnimationFrame(animation);
      observer.disconnect();
    };
  }, [mode, theme]);

  return <canvas ref={canvasRef} className={`mode-preview ${className}`} aria-hidden="true" />;
}
