import type { ComponentType } from 'react';
import { AppShell } from './components/layout/AppShell';
import { useHashRoute } from './hooks/useHashRoute';
import type { PageProps, Route } from './types';
import Home from './pages/Home/Home';
import Studio from './pages/Studio/Studio';
import Gallery from './pages/Gallery/Gallery';
import Settings from './pages/Settings/Settings';
import About from './pages/About/About';

const PAGES: Record<Route, ComponentType<PageProps>> = {
  '/': Home,
  '/studio': Studio,
  '/gallery': Gallery,
  '/settings': Settings,
  '/about': About,
};

export default function App() {
  const [route, navigate] = useHashRoute();
  const Page = PAGES[route];

  return (
    <AppShell header={<div className="brand">AURA</div>}>
      <Page onNavigate={navigate} />
    </AppShell>
  );
}
