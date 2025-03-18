export const ColourMode = {
  DIGITS: 'DIGITS',
  SYMBOLS: 'SYMBOLS',
  NONE: 'NONE',
} as const;

export type ColourModeType = keyof typeof ColourMode;
