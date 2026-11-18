import { Activity } from 'lucide-react';

const METRICS = ['Overall', 'Bass', 'Mid', 'Treble'];

export function AudioInsights() {
  return (
    <section className="panel panel-solid studio-insights" aria-labelledby="insights-title">
      <div className="panel-header">
        <h2 className="panel-title" id="insights-title">
          <Activity size={14} strokeWidth={1.8} aria-hidden="true" />
          Audio Insights
        </h2>
        <span className="label">Live</span>
      </div>
      <div className="panel-body insights-body">
        <div className="insight-status">
          <span className="label">Playback status</span>
          <span className="chip">Empty</span>
        </div>
        <div className="insight-meters">
          {METRICS.map((metric) => (
            <div className="insight-meter" key={metric}>
              <div className="insight-meter-head">
                <span>{metric}</span>
                <span className="mono">—</span>
              </div>
              <div className="meter-track">
                <span className="meter-fill" style={{ width: '0%' }} />
              </div>
            </div>
          ))}
        </div>
        <p className="insight-disclaimer">
          Relative activity from browser analysis. Not calibrated audio measurements.
        </p>
      </div>
    </section>
  );
}
