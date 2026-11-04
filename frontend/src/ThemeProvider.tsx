import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { darkColors, lightColors, type Palette, type ThemeMode } from './theme';

const STORAGE_KEY = 'portfolio_theme';

interface ThemeValue {
  mode: ThemeMode;
  colors: Palette;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

function initialMode(): ThemeMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const colors = mode === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.setProperty('color-scheme', mode);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute('content', colors.bg);

    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Sin localStorage (modo privado estricto) el tema funciona solo en esta sesión.
    }
  }, [colors.bg, mode]);

  const toggle = useCallback(
    () => setMode((current) => (current === 'dark' ? 'light' : 'dark')),
    [],
  );

  const value = useMemo(() => ({ mode, colors, toggle }), [colors, mode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme debe usarse dentro de ThemeProvider.');
  return value;
}
