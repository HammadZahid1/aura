import { useEffect, useState } from 'react';
import type { Route } from '../types';

const ROUTES: Route[] = ['/', '/studio', '/gallery', '/settings', '/about'];

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES.find((route) => route === hash) ?? '/';
}

/** Minimal offline-friendly routing using the URL hash. No router dependency required. */
export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const handleChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  const navigate = (next: Route) => {
    if (window.location.hash.replace(/^#/, '') === next) return;
    window.location.hash = next;
    setRoute(next);
  };

  return [route, navigate];
}
