import { AudioWaveform, CircleDot, Layers3, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  index: string;
  title: string;
  copy: string;
}

const FEATURES: Feature[] = [
  {
    icon: AudioWaveform,
    index: '01',
    title: 'Real analysis',
    copy: 'Native Web Audio analysis reads frequency and waveform data from the audio you load.',
  },
  {
    icon: Layers3,
    index: '02',
    title: 'Five visualizers',
    copy: 'Move between a radial spectrum, waveform, analyzer, particle field and orbital rings.',
  },
  {
    icon: Sparkles,
    index: '03',
    title: 'Made to tune',
    copy: 'Shape sensitivity, motion, density, glow and colour until the stage feels like yours.',
  },
  {
    icon: ShieldCheck,
    index: '04',
    title: 'Private by default',
    copy: 'Files stay in your browser. No upload, no account, no network call for your audio.',
  },
];

const STEPS: Array<{ icon: LucideIcon; title: string; copy: string }> = [
  { icon: CircleDot, title: 'Load a track', copy: 'Drop in a supported audio file or choose one from your device.' },
  { icon: Waves, title: 'Pick a visualizer', copy: 'Select a mode and tune the parameters that matter to it.' },
  { icon: Sparkles, title: 'Press play', copy: 'Watch the stage respond to the sound, frame by frame.' },
];

export function FeatureStrip() {
  return (
    <>
      <section className="home-section container" aria-labelledby="features-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Built for listening</span>
            <h2 id="features-title" className="heading-lg section-title">
              An instrument for<br />
              <span className="text-gradient">the way sound looks.</span>
            </h2>
          </div>
          <p className="lead section-intro">
            AURA is a focused creative space. Nothing between you and the signal —
            just your audio, a canvas and a set of controls that respond instantly.
          </p>
        </div>

        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article className="feature-item" key={feature.index}>
              <div className="feature-top">
                <span className="feature-icon">
                  <feature.icon size={18} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="mono feature-index">{feature.index}</span>
              </div>
              <h3 className="heading-md feature-title">{feature.title}</h3>
              <p className="feature-copy">{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section-tight container" aria-labelledby="workflow-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Three steps</span>
            <h2 id="workflow-title" className="heading-lg section-title">From file to frequency.</h2>
          </div>
        </div>
        <ol className="step-grid">
          {STEPS.map((step, index) => (
            <li className="step-item" key={step.title}>
              <span className="mono step-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="step-icon">
                <step.icon size={17} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
