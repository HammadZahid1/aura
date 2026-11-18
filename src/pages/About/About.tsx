import { ArrowRight, AudioLines, Cpu, ShieldCheck, Sparkles } from 'lucide-react';
import type { PageProps } from '../../types';

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'Local by design',
    body: 'Your audio is decoded and analysed in the browser. Nothing is uploaded, stored in the cloud, or sent to a third party.',
  },
  {
    icon: Cpu,
    title: 'Native Web Audio',
    body: 'A single analyser node feeds every renderer. No external processing service, no API keys, no network dependency.',
  },
  {
    icon: Sparkles,
    title: 'Built for exploration',
    body: 'Five visual modes, five themes, and live controls turn a private listening session into a visual instrument.',
  },
];

const STEPS = [
  { number: '01', title: 'Load', body: 'Drop an audio file into the studio. It stays on your device as a temporary local URL.' },
  { number: '02', title: 'Analyse', body: 'The Web Audio API reads frequency bins, waveform samples, RMS level and relative bands.' },
  { number: '03', title: 'Render', body: 'Canvas 2D transforms those measurements into light, motion and colour in real time.' },
];

const STACK = ['React', 'TypeScript', 'Vite', 'Web Audio API', 'Canvas 2D', 'Tailwind CSS', 'Vitest'];

export default function About({ onNavigate }: PageProps) {
  return (
    <div className="page container about-page">
      <header className="page-intro">
        <div>
          <span className="eyebrow">About / 04</span>
          <h1 className="heading-lg">A studio for seeing sound.</h1>
          <p className="page-intro__copy">
            AURA is a frontend-only audio visualization studio. It turns the music you already own into a
            cinematic, responsive light show — without ever asking you to send it anywhere.
          </p>
        </div>
        <span className="chip"><span className="chip-dot" /> 100% local</span>
      </header>

      <section className="about-principles" aria-label="Design principles">
        {PRINCIPLES.map(({ icon: Icon, title, body }) => (
          <article className="glass-panel about-principle" key={title}>
            <span className="about-icon"><Icon size={18} strokeWidth={1.6} aria-hidden="true" /></span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="about-flow glass-panel" aria-labelledby="flow-title">
        <div className="about-flow__head">
          <span className="eyebrow">Signal path</span>
          <h2 id="flow-title">From file to light in three steps</h2>
        </div>
        <div className="about-steps">
          {STEPS.map((step) => (
            <article className="about-step" key={step.number}>
              <span className="mono about-step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-stack glass-panel" aria-labelledby="stack-title">
        <div>
          <span className="eyebrow">Crafted with</span>
          <h2 id="stack-title">A focused, modern frontend</h2>
        </div>
        <div className="about-stack__chips">
          {STACK.map((item) => <span className="chip" key={item}>{item}</span>)}
        </div>
      </section>

      <section className="about-cta glass-panel">
        <div>
          <AudioLines size={22} strokeWidth={1.5} aria-hidden="true" />
          <h2>Ready to see what you hear?</h2>
          <p>Load a track and let the visualizers respond to every beat, breath and frequency.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('/studio')}>
          Open the Studio <ArrowRight size={15} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
