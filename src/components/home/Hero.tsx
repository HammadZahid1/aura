import { motion } from 'framer-motion';
import { ArrowRight, AudioLines, Play } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import type { Route } from '../../types';

interface HeroProps {
  onNavigate: (route: Route) => void;
}

const rise = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rise}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow"
        >
          Interactive audio visualization studio
        </motion.div>

        <motion.h1
          id="hero-title"
          className="heading-xl hero-title"
          initial="hidden"
          animate="visible"
          variants={rise}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Feel the frequency.
          <br />
          <span className="text-gradient">See the sound.</span>
        </motion.h1>

        <motion.p
          className="lead hero-lead"
          initial="hidden"
          animate="visible"
          variants={rise}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          Transform your audio into immersive real-time visual experiences.
          Upload a track, choose a visualizer, and watch every frequency come alive —
          right here in your browser.
        </motion.p>

        <motion.div
          className="button-row"
          initial="hidden"
          animate="visible"
          variants={rise}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="btn btn-primary hero-primary" onClick={() => onNavigate('/studio')}>
            <Play size={15} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
            Enter Studio
          </button>
          <button className="btn hero-secondary" onClick={() => onNavigate('/gallery')}>
            Explore Visualizers
            <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </motion.div>

        <motion.div
          className="hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
        >
          <span>
            <AudioLines size={13} strokeWidth={1.7} aria-hidden="true" />
            Web Audio API
          </span>
          <span className="hero-meta-divider" />
          <span>100% local processing</span>
          <span className="hero-meta-divider" />
          <span>No account required</span>
        </motion.div>
      </div>

      <motion.div
        className="hero-stage"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero-stage-frame panel">
          <div className="hero-stage-top">
            <span className="label">Live composition</span>
            <span className="chip">
              <span className="chip-dot" />
              Idle motion
            </span>
          </div>
          <HeroVisual />
          <div className="hero-stage-bottom">
            <span className="mono">AURA / IDLE</span>
            <span className="mono">00 : 00 : 00</span>
          </div>
        </div>
        <div className="hero-stage-glow" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
