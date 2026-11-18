import { ShieldCheck } from 'lucide-react';
import type { Route } from '../../types';

const LINKS: Array<{ label: string; route: Route }> = [
  { label: 'Studio', route: '/studio' },
  { label: 'Visualizers', route: '/gallery' },
  { label: 'Settings', route: '/settings' },
  { label: 'About', route: '/about' },
];

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="footer-wordmark">AURA</span>
          <span className="footer-separator" />
          <span className="footer-note">Feel the frequency. See the sound.</span>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {LINKS.map((link) => (
            <a key={link.route} href={`#${link.route}`}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="footer-privacy">
          <ShieldCheck size={13} strokeWidth={1.8} aria-hidden="true" />
          Local by design — no audio leaves your device
        </div>
      </div>
    </footer>
  );
}
