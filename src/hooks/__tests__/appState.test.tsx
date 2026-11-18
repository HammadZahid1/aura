import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PreferencesProvider } from '../../context/PreferencesProvider';
import { useHashRoute } from '../useHashRoute';
import { usePreferences } from '../usePreferences';
import type { VisualizationMode } from '../../types';

function RouteHarness() {
  const [route, navigate] = useHashRoute();
  return (
    <div>
      <output data-testid="route">{route}</output>
      <button type="button" onClick={() => navigate('/studio')}>Go to studio</button>
    </div>
  );
}

function PreferencesHarness() {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  return (
    <div>
      <output data-testid="mode">{preferences.mode}</output>
      <button type="button" onClick={() => updatePreferences({ mode: 'waveform' as VisualizationMode })}>
        Use waveform
      </button>
      <button type="button" onClick={resetPreferences}>Reset</button>
    </div>
  );
}

describe('useHashRoute', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('reads the current hash and navigates without a page reload', () => {
    render(<RouteHarness />);
    expect(screen.getByTestId('route')).toHaveTextContent('/');

    fireEvent.click(screen.getByText('Go to studio'));
    expect(screen.getByTestId('route')).toHaveTextContent('/studio');
    expect(window.location.hash).toBe('#/studio');
  });
});

describe('PreferencesProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('updates, persists and resets visualization preferences', () => {
    const first = render(
      <PreferencesProvider>
        <PreferencesHarness />
      </PreferencesProvider>,
    );

    fireEvent.click(screen.getByText('Use waveform'));
    expect(screen.getByTestId('mode')).toHaveTextContent('waveform');
    expect(window.localStorage.getItem('aura.preferences')).toContain('waveform');

    first.unmount();
    render(
      <PreferencesProvider>
        <PreferencesHarness />
      </PreferencesProvider>,
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('waveform');

    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByTestId('mode')).toHaveTextContent('aura-ring');
  });
});
