export class Colour {
  rgb: RGB;
  hsl: HSL;
  hsb: HSB;
  hex: string;

  constructor(initialColour = '#ff0000') {
    this.rgb = { r: 255, g: 0, b: 0 };
    this.hsl = { h: 0, s: 100, l: 50 };
    this.hsb = { h: 0, s: 100, b: 100 };
    this.hex = '#ff0000';
    if (initialColour) this.setHex(initialColour);
  }

  setRGB(rgb: RGB) {
    if (rgb.r === this.rgb.r && rgb.g === this.rgb.g && rgb.b === this.rgb.b) {
      return;
    }

    this.rgb = { ...rgb };
    this.hsl = Colour.rgbToHsl(this.rgb);
    this.hsb = Colour.hslToHsb(this.hsl);
    this.hex = Colour.rgbToHex(this.rgb);
  }

  setHSL(hsl: HSL) {
    if (hsl.h === this.hsl.h && hsl.s === this.hsl.s && hsl.l === this.hsl.l) {
      return;
    }

    this.hsl = { ...hsl };
    this.hsb = Colour.hslToHsb(this.hsl);
    this.rgb = Colour.hslToRgb(this.hsl);
    this.hex = Colour.rgbToHex(this.rgb);
  }

  setHSB(hsb: HSB) {
    if (hsb.h === this.hsb.h && hsb.s === this.hsb.s && hsb.b === this.hsb.b) {
      return;
    }

    this.hsb = { ...hsb };
    this.hsl = Colour.hsbToHsl(this.hsb);
    this.rgb = Colour.hslToRgb(this.hsl);
    this.hex = Colour.rgbToHex(this.rgb);
  }

  setHex(hex: string) {
    const h = hex.startsWith('#') ? hex : '#' + hex;

    if (h.toLowerCase() === this.hex.toLowerCase()) {
      return;
    }

    this.hex = h.toLowerCase();
    this.rgb = Colour.hexToRgb(this.hex);
    this.hsl = Colour.rgbToHsl(this.rgb);
    this.hsb = Colour.hslToHsb(this.hsl);
  }

  getValues(): ColourValues {
    return {
      rgb: { ...this.rgb },
      hsl: { ...this.hsl },
      hsb: { ...this.hsb },
      hex: this.hex,
    };
  }

  static rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
          ? 2 + (b - r) / s
          : 4 + (r - g) / s
      : 0;

    return {
      h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
      s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      l: (100 * (2 * l - s)) / 2,
    };
  }

  static hslToHsb(hsl: HSL): HSB {
    const b = hsl.l + (hsl.s / 100) * Math.min(hsl.l, 100 - hsl.l);
    const s = b === 0 ? 0 : 2 * (1 - hsl.l / b) * 100;

    return { h: hsl.h, s, b };
  }

  static rgbToHex(rgb: RGB): string {
    const hex = ((rgb.r << 16) + (rgb.g << 8) + rgb.b)
      .toString(16)
      .padStart(6, '0');
    return ('#' + hex).toLowerCase();
  }

  static hslToRgb(hsl: HSL): RGB {
    const s = hsl.s / 100;
    const l = hsl.l / 100;
    const k = (n: number) => (n + hsl.h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  }

  static hsbToHsl(hsb: HSB): HSL {
    const l = (hsb.b / 100) * (100 - hsb.s / 2);
    const s =
      l === 0 || l === 100
        ? 0
        : Math.abs(((hsb.b - l) / Math.min(l, 100 - l)) * 100);

    return { h: Math.round(hsb.h), s: Math.round(s), l: Math.round(l) };
  }

  static hexToRgb(hex: string): RGB {
    let h = hex.slice(hex.startsWith('#') ? 1 : 0);
    if (h.length === 3) h = [...h.split('')].map((x) => x + x).join('');
    const c = parseInt(h, 16);

    return {
      r: c >>> 16,
      g: (c & 0x00ff00) >>> 8,
      b: (c & 0x0000ff) >>> 0,
    };
  }

  static convertToMonochrome(
    hex: string,
    options = { primary: '#000000', secondary: '#FFFFFF' },
  ) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 > 186
      ? options.primary
      : options.secondary;
  }
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSB {
  h: number;
  s: number;
  b: number;
}

export interface ColourValues {
  rgb: RGB;
  hsl: HSL;
  hsb: HSB;
  hex: string;
}
