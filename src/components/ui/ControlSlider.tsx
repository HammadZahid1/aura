interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display?: string;
  hint?: string;
  onChange: (value: number) => void;
}

export function ControlSlider({ label, value, min, max, step, display, hint, onChange }: ControlSliderProps) {
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <label className="control-slider">
      <span className="control-head">
        <span>{label}</span>
        <span className="mono control-value">{display ?? value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        style={{ '--range-fill': `${fill}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint && <span className="control-hint">{hint}</span>}
    </label>
  );
}
