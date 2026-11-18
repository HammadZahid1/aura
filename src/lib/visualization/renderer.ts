import type { AudioFrame, ThemeDefinition, VisualizerConfig, VisualizationMode } from '../../types';

/** Everything a renderer needs for one frame. Reused between frames to avoid allocations. */
export interface RenderParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  frame: AudioFrame;
  config: VisualizerConfig;
  theme: ThemeDefinition;
  time: number;
}

export type VisualizationRenderer = (params: RenderParams) => void;

/** Placeholder used until each mode's renderer is registered in later milestones. */
export const placeholderRenderer: VisualizationRenderer = ({ ctx, width, height }) => {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  const radius = Math.min(width, height) * 0.24;
  for (let ring = 1; ring <= 3; ring += 1) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius * ring, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
};

const registry: Partial<Record<VisualizationMode, VisualizationRenderer>> = {};

export function registerRenderer(mode: VisualizationMode, renderer: VisualizationRenderer): void {
  registry[mode] = renderer;
}

export function getRenderer(mode: VisualizationMode): VisualizationRenderer {
  return registry[mode] ?? placeholderRenderer;
}
