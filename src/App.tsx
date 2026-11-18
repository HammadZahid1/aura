import type { ComponentType } from 'react';
import { AppShell } from './components/layout/AppShell';
import { TopNav } from './components/navigation/TopNav';
import { ThemeProvider } from './context/ThemeProvider';
import { PreferencesProvider } from './context/PreferencesProvider';
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

function RoutedApp() {
  const [route, navigate] = useHashRoute();
  const Page = PAGES[route];

  return (
    <AppShell header={<TopNav route={route} onNavigate={navigate} />}>
      <Page onNavigate={navigate} />
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <RoutedApp />
      </PreferencesProvider>
    </ThemeProvider>
  );
}
