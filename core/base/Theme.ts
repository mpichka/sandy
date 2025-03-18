import { ThemeMode, type ThemeModeType } from '../constants';

export class Theme {
  mode: ThemeModeType = ThemeMode.LIGHT;
  private constants = {
    common: {
      controls: {
        strokeColour: '#42A5F5',
        fillColour: '#FFFFFF',
        padding: 10, // in pixels
        diameter: 6,
      },
    },
    [ThemeMode.LIGHT]: {
      backgroundColour: '#E3E3E3',
    },
    [ThemeMode.DARK]: {
      backgroundColour: '#5F6369',
    },
  } as const;

  get backgroundColour() {
    return this.constants[this.mode].backgroundColour;
  }

  get controls() {
    return this.constants.common.controls;
  }
}
