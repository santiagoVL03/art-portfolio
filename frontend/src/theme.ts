export type ThemeMode = 'dark' | 'light';

export interface Palette {
  bg: string;
  surface: string;
  surfaceRaised: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  onInk: string;
  danger: string;
  success: string;
  overlay: string;
  imageBg: string;
}

export const darkColors: Palette = {
  bg: '#0d0c0a',
  surface: '#161411',
  surfaceRaised: '#1e1b17',
  ink: '#f3eee4',
  muted: '#a79e90',
  line: '#2b2722',
  accent: '#e2835a',
  accentSoft: '#2a1f19',
  onAccent: '#160f0b',
  onInk: '#12100d',
  danger: '#f08a7a',
  success: '#9fc48f',
  overlay: 'rgba(5, 4, 3, 0.8)',
  imageBg: '#221d18',
};

export const lightColors: Palette = {
  bg: '#f7f4ee',
  surface: '#ffffff',
  surfaceRaised: '#fffdf8',
  ink: '#1c1a17',
  muted: '#6f6a61',
  line: '#e4ded2',
  accent: '#b4532a',
  accentSoft: '#f0e2d7',
  onAccent: '#ffffff',
  onInk: '#f7f4ee',
  danger: '#a33a2f',
  success: '#3f6b3a',
  overlay: 'rgba(28, 26, 23, 0.58)',
  imageBg: '#efe8dc',
};

export const fonts = {
  display: 'Georgia, "Iowan Old Style", "Times New Roman", serif',
  body: 'Inter, "Helvetica Neue", Arial, sans-serif',
};
