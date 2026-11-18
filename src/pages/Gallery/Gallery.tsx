import { Activity, ArrowRight, AudioLines, BarChart3, Orbit, Sparkles } from 'lucide-react';
import { ModePreview } from '../../components/gallery/ModePreview';
import { MODES } from '../../data/visualizers';
import { usePreferences } from '../../hooks/usePreferences';
import type { PageProps } from '../../types';

const MODE_ICONS = {
  ring: Activity,
  wave: AudioLines,
  spectrum: BarChart3,
  particles: Sparkles,
  orbital: Orbit,
};

export default function Gallery({ onNavigate }: PageProps) {
  const { updatePreferences } = usePreferences();

  const openInStudio = (mode: (typeof MODES)[number]['id']) => {
    updatePreferences({ mode });
    onNavigate('/studio');
  };

  return (
    <div className="page container gallery-page">
      <header className="page-intro">
        <div>
          <span className="eyebrow">Explore / 02</span>
          <h1 className="heading-lg">Visualization Gallery</h1>
          <p className="page-intro__copy">
            Five ways to see sound. Each preview is rendered locally with the same engine the studio uses.
          </p>
        </div>
        <span className="chip">{String(MODES.length).padStart(2, '0')} modes</span>
      </header>

      <div className="gallery-grid">
        {MODES.map((mode, index) => {
          const Icon = MODE_ICONS[mode.icon];
          return (
            <article className="gallery-card glass-panel" key={mode.id}>
              <div className="gallery-card__preview">
                <ModePreview mode={mode.id} overrides={{ barCount: 48, particleDensity: 90 }} />
                <span className="gallery-card__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="gallery-card__badge">Live preview</span>
              </div>
              <div className="gallery-card__body">
                <div className="gallery-card__title">
                  <span className="gallery-card__icon"><Icon size={16} strokeWidth={1.7} aria-hidden="true" /></span>
                  <h2>{mode.label}</h2>
                </div>
                <p>{mode.description}</p>
                <p className="gallery-card__detail">{mode.detail}</p>
                <button type="button" className="text-action" onClick={() => openInStudio(mode.id)}>
                  Open in Studio <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <section className="gallery-note glass-panel">
        <div>
          <span className="eyebrow">Under the hood</span>
          <h2>No upload. No waiting. No cloud.</h2>
          <p>
            The analyser reads your audio in the browser and feeds these renderers in real time. Your files
            never leave your device.
          </p>
        </div>
        <button type="button" className="btn" onClick={() => onNavigate('/settings')}>
          Tune defaults
        </button>
      </section>
    </div>
  );
}
