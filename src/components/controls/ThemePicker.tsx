import { THEME_LIST } from '../../data/themes';
import { cn } from '../../lib/utilities/cn';
import { useTheme } from '../../hooks/useTheme';

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-picker" role="group" aria-label="Color theme">
      {THEME_LIST.map((option) => (
        <button
          key={option.id}
          className={cn('theme-option', theme === option.id && 'is-active')}
          aria-pressed={theme === option.id}
          title={option.description}
          onClick={() => setTheme(option.id)}
        >
          <span
            className="theme-swatch"
            style={{
              background: `linear-gradient(135deg, ${option.primary}, ${option.secondary} 55%, ${option.accent})`,
            }}
          />
          <span className="theme-name">{option.name}</span>
        </button>
      ))}
    </div>
  );
}
