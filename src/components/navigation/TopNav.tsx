import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utilities/cn';
import type { Route } from '../../types';

interface TopNavProps {
  route: Route;
  onNavigate: (route: Route) => void;
}

const NAV_ITEMS: Array<{ label: string; route: Route }> = [
  { label: 'Home', route: '/' },
  { label: 'Studio', route: '/studio' },
  { label: 'Visualizers', route: '/gallery' },
  { label: 'Settings', route: '/settings' },
  { label: 'About', route: '/about' },
];

export function TopNav({ route, onNavigate }: TopNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [route]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const go = (next: Route) => {
    onNavigate(next);
    setOpen(false);
  };

  return (
    <div className="nav-inner container">
      <a
        href="#/"
        className="nav-brand"
        aria-label="AURA home"
        onClick={(event) => {
          event.preventDefault();
          go('/');
        }}
      >
        <span className="brand-mark" aria-hidden="true">
          <span />
        </span>
        <span className="nav-wordmark">AURA</span>
        <span className="nav-brand-tag">/ VISUAL STUDIO</span>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.route}
            href={`#${item.route}`}
            aria-current={route === item.route ? 'page' : undefined}
            className={cn('nav-link', route === item.route && 'is-active')}
            onClick={(event) => {
              event.preventDefault();
              go(item.route);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <span className="nav-local chip">
          <span className="chip-dot" />
          Local engine
        </span>
        <button className="btn btn-accent nav-cta" onClick={() => go('/studio')}>
          Open Studio
          <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      <button
        className="icon-button nav-toggle"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="aura-mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
      </button>

      <nav
        id="aura-mobile-nav"
        className={cn('mobile-nav', open && 'is-open')}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {NAV_ITEMS.map((item, index) => (
          <a
            key={item.route}
            href={`#${item.route}`}
            tabIndex={open ? 0 : -1}
            aria-current={route === item.route ? 'page' : undefined}
            className={cn('mobile-nav-link', route === item.route && 'is-active')}
            onClick={(event) => {
              event.preventDefault();
              go(item.route);
            }}
          >
            <span className="mono">{String(index + 1).padStart(2, '0')}</span>
            {item.label}
            <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </div>
  );
}
