import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

function readInitialTheme() {
  // index.html already applied the saved/system theme before React started.
  return document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1120' : '#0f172a');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Storage can be unavailable (private mode); the theme still applies for this visit.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
