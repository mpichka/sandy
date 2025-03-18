import { ColourMode, type ColourModeType } from '../constants';
import { PaletteColour } from '../interfaces';

export class Palette {
  colorMode: ColourModeType = ColourMode.DIGITS;
  activeColor: PaletteColour | null = null;
  colors: PaletteColour[] = [];

  getColor(uid: number) {
    return this.colors.find((item) => item.uid === uid);
  }

  setColorMode(mode: ColourModeType) {
    this.colorMode = mode;
  }

  setActiveColor(color: PaletteColour) {
    this.activeColor = color;
  }

  setPalette(colors: PaletteColour[]) {
    this.colors = colors;
  }
}
