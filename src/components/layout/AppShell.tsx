import type { ReactNode } from 'react';
import { Footer } from './Footer';

interface AppShellProps {
  children: ReactNode;
  header: ReactNode;
  immersive?: boolean;
}

export function AppShell({ children, header, immersive = false }: AppShellProps) {
  return (
    <div className="aura-root">
      {!immersive && <header className="app-header">{header}</header>}
      <main id="main-content" className="app-main">
        {children}
      </main>
      {!immersive && <Footer />}
    </div>
  );
}
