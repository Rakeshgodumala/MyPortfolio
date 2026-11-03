import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className={`btn btn-ghost icon-btn ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
    </button>
  );
}
