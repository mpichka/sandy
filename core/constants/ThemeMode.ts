export const ThemeMode = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
} as const;

export type ThemeModeType = keyof typeof ThemeMode;
