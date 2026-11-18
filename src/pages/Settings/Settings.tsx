import { ArrowRight, Palette, RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { ModePreview } from '../../components/gallery/ModePreview';
import { ThemePicker } from '../../components/controls/ThemePicker';
import { ControlSlider } from '../../components/ui/ControlSlider';
import { THEMES } from '../../data/themes';
import { MODES } from '../../data/visualizers';
import { usePreferences } from '../../hooks/usePreferences';
import { useTheme } from '../../hooks/useTheme';
import { normalizeConfig, SETTING_RANGES, type VisualizerNumericSetting } from '../../lib/config/visualizerConfig';
import { cn } from '../../lib/utilities/cn';
import type { StudioPreferences } from '../../context/preferencesContext';
import type { PageProps } from '../../types';

export default function Settings({ onNavigate }: PageProps) {
  const { theme, setTheme } = useTheme();
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  const config = normalizeConfig({ ...preferences, theme });

  const setSetting = (key: VisualizerNumericSetting, value: number) => {
    updatePreferences({ [key]: value } as Partial<StudioPreferences>);
  };

  const resetAll = () => {
    resetPreferences();
    setTheme('cyan');
  };

  const usesBars = config.mode === 'aura-ring' || config.mode === 'spectrum' || config.mode === 'orbital';

  return (
    <div className="page container settings-page">
      <header className="page-intro">
        <div>
          <span className="eyebrow">Configure / 03</span>
          <h1 className="heading-lg">Settings</h1>
          <p className="page-intro__copy">
            Choose how the studio opens. Defaults are saved on this device and applied the next time you enter the workspace.
          </p>
        </div>
        <button type="button" className="btn" onClick={resetAll}>
          <RotateCcw size={14} aria-hidden="true" /> Reset defaults
        </button>
      </header>

      <div className="settings-grid">
        <section className="panel panel-solid settings-preview" aria-labelledby="preview-title">
          <div className="panel-header">
            <h2 className="panel-title" id="preview-title">
              <SlidersHorizontal size={14} strokeWidth={1.8} aria-hidden="true" />
              Live preview
            </h2>
            <span className="label">Synthetic signal</span>
          </div>
          <div className="settings-preview__canvas">
            <ModePreview mode={config.mode} overrides={config} />
          </div>
          <div className="settings-preview__footer">
            <div>
              <span className="label">Selected mode</span>
              <strong>{MODES.find((mode) => mode.id === config.mode)?.label}</strong>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('/studio')}>
              Open Studio <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </section>

        <div className="settings-columns">
          <section className="panel panel-solid settings-panel" aria-labelledby="appearance-title">
            <div className="panel-header">
              <h2 className="panel-title" id="appearance-title">
                <Palette size={14} strokeWidth={1.8} aria-hidden="true" />
                Appearance
              </h2>
            </div>
            <div className="settings-panel__body">
              <p className="settings-panel__copy">{THEMES[theme].description}</p>
              <ThemePicker />
            </div>
          </section>

          <section className="panel panel-solid settings-panel" aria-labelledby="default-mode-title">
            <div className="panel-header">
              <h2 className="panel-title" id="default-mode-title">Default mode</h2>
            </div>
            <div className="settings-panel__body">
              <div className="settings-mode-list" role="group" aria-label="Default visualization mode">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={cn('settings-mode-option', config.mode === mode.id && 'is-active')}
                    aria-pressed={config.mode === mode.id}
                    onClick={() => updatePreferences({ mode: mode.id })}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="panel panel-solid settings-panel" aria-labelledby="response-title">
            <div className="panel-header">
              <h2 className="panel-title" id="response-title">Response &amp; motion</h2>
            </div>
            <div className="settings-panel__body settings-sliders">
              <ControlSlider
                label="Sensitivity"
                value={config.sensitivity}
                min={SETTING_RANGES.sensitivity.min}
                max={SETTING_RANGES.sensitivity.max}
                step={SETTING_RANGES.sensitivity.step}
                display={`${config.sensitivity.toFixed(2)}×`}
                onChange={(value) => setSetting('sensitivity', value)}
              />
              <ControlSlider
                label="Animation speed"
                value={config.speed}
                min={SETTING_RANGES.speed.min}
                max={SETTING_RANGES.speed.max}
                step={SETTING_RANGES.speed.step}
                display={`${config.speed.toFixed(2)}×`}
                onChange={(value) => setSetting('speed', value)}
              />
              {usesBars && (
                <ControlSlider
                  label="Bar count"
                  value={config.barCount}
                  min={SETTING_RANGES.barCount.min}
                  max={SETTING_RANGES.barCount.max}
                  step={SETTING_RANGES.barCount.step}
                  display={String(config.barCount)}
                  onChange={(value) => setSetting('barCount', value)}
                />
              )}
              {config.mode === 'particles' && (
                <ControlSlider
                  label="Particle density"
                  value={config.particleDensity}
                  min={SETTING_RANGES.particleDensity.min}
                  max={SETTING_RANGES.particleDensity.max}
                  step={SETTING_RANGES.particleDensity.step}
                  display={String(config.particleDensity)}
                  onChange={(value) => setSetting('particleDensity', value)}
                />
              )}
              {config.mode === 'waveform' && (
                <ControlSlider
                  label="Wave thickness"
                  value={config.waveThickness}
                  min={SETTING_RANGES.waveThickness.min}
                  max={SETTING_RANGES.waveThickness.max}
                  step={SETTING_RANGES.waveThickness.step}
                  display={`${config.waveThickness.toFixed(1)} px`}
                  onChange={(value) => setSetting('waveThickness', value)}
                />
              )}
              <ControlSlider
                label="Glow"
                value={config.glow}
                min={SETTING_RANGES.glow.min}
                max={SETTING_RANGES.glow.max}
                step={SETTING_RANGES.glow.step}
                display={`${config.glow.toFixed(2)}×`}
                onChange={(value) => setSetting('glow', value)}
              />
              <ControlSlider
                label="Background"
                value={config.backgroundBrightness}
                min={SETTING_RANGES.backgroundBrightness.min}
                max={SETTING_RANGES.backgroundBrightness.max}
                step={SETTING_RANGES.backgroundBrightness.step}
                display={`${Math.round(config.backgroundBrightness * 100)}%`}
                onChange={(value) => setSetting('backgroundBrightness', value)}
              />
            </div>
          </section>

          <section className="panel panel-solid settings-panel" aria-labelledby="privacy-title">
            <div className="panel-header">
              <h2 className="panel-title" id="privacy-title">
                <ShieldCheck size={14} strokeWidth={1.8} aria-hidden="true" />
                Privacy
              </h2>
            </div>
            <div className="settings-panel__body">
              <p className="settings-panel__copy">
                Audio is analysed locally with the Web Audio API. Files are never uploaded, stored, or sent anywhere.
                Only your interface preferences are saved in this browser.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
