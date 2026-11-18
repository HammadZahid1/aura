import { Activity, AudioLines, CircleDot, Waves } from 'lucide-react';
import { THEMES } from '../../data/themes';
import type { AudioSnapshot, PlaybackStatus, ThemeName } from '../../types';

interface AudioInsightsProps {
  status: PlaybackStatus;
  snapshot: AudioSnapshot | null;
  theme: ThemeName;
}

interface Meter {
  label: string;
  value: number;
  from: string;
  to: string;
}

function percent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value * 100)));
}

export function AudioInsights({ status, snapshot, theme }: AudioInsightsProps) {
  const colors = THEMES[theme];
  const active = snapshot?.active ?? false;
  const level = snapshot?.level ?? 0;
  const peak = snapshot?.peak ?? 0;
  const bands = snapshot?.bands ?? { bass: 0, mid: 0, treble: 0, overall: 0 };

  const meters: Meter[] = [
    { label: 'Overall', value: bands.overall, from: colors.primary, to: colors.secondary },
    { label: 'Bass', value: bands.bass, from: colors.primary, to: colors.secondary },
    { label: 'Mid', value: bands.mid, from: colors.secondary, to: colors.accent },
    { label: 'Treble', value: bands.treble, from: colors.accent, to: colors.primary },
  ];

  return (
    <section className="panel panel-solid studio-insights" aria-labelledby="insights-title">
      <div className="panel-header">
        <h2 className="panel-title" id="insights-title">
          <Activity size={14} strokeWidth={1.8} aria-hidden="true" />
          Audio Insights
        </h2>
        <span className="label">{active ? 'Live analysis' : 'Idle'}</span>
      </div>

      <div className="panel-body insights-body">
        <div className="insight-status">
          <span className="label">Playback status</span>
          <strong className="insight-level">{percent(level)}</strong>
          <span className="insight-unit">RMS level / 100</span>
          <div className="insight-peak">
            <CircleDot size={12} strokeWidth={1.7} aria-hidden="true" />
            Peak hold {percent(peak)}%
          </div>
          <span className="chip">
            <span className="chip-dot" />
            {status}
          </span>
        </div>

        <div className="insight-meters" aria-label="Frequency band activity">
          {meters.map((meter) => (
            <div className="insight-meter" key={meter.label}>
              <div className="insight-meter-head">
                <span>{meter.label}</span>
                <span className="mono">{percent(meter.value)}%</span>
              </div>
              <div className="meter-track">
                <span
                  className="meter-fill"
                  style={{
                    width: `${percent(meter.value)}%`,
                    background: `linear-gradient(90deg, ${meter.from}, ${meter.to})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="insight-spectrum-wrap">
          <div className="insight-spectrum-title">
            <AudioLines size={13} strokeWidth={1.7} aria-hidden="true" />
            Spectrum distribution
            <Waves size={13} strokeWidth={1.7} aria-hidden="true" />
          </div>
          <div className="insight-spectrum" aria-hidden="true">
            {(snapshot?.spectrum ?? Array.from({ length: 28 }, () => 0)).map((value, index) => {
              const height = active
                ? Math.max(5, (value / 255) * 100)
                : 8 + ((index * 7) % 18);
              return <span key={index} style={{ height: `${height}%` }} />;
            })}
          </div>
          <p className="insight-disclaimer">
            Relative activity measured locally by the Web Audio API. Not calibrated audio measurements.
          </p>
        </div>
      </div>
    </section>
  );
}
