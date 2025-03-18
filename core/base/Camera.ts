import type { DeviceSettings, Point } from '../interfaces';
import { Container } from './Container';

export class Camera {
  readonly container: Container;
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  zoom = 1;
  dpi = 1;
  left = 0;
  right = 0;
  top = 0;
  bottom = 0;

  constructor(container: Container, canvas: HTMLCanvasElement) {
    this.container = container;
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) {
      throw new Error('Canvas context is not supported');
    }

    this.ctx = ctx;
  }

  applyDeviceSettings(device: DeviceSettings) {
    this.dpi = device.dpi || 1;
    this.ctx.scale(this.dpi, this.dpi);

    this.canvas.width = Math.floor(device.width * this.dpi);
    this.canvas.style.width = device.width + 'px';

    this.canvas.height = Math.floor(device.height * this.dpi);
    this.canvas.style.height = device.height + 'px';

    this.top = 0;
    this.left = 0;
    this.right = device.width;
    this.bottom = device.height;
  }

  getProjectedPoint(point: Point): Point {
    return {
      x: Math.round(point.x / this.scale - this.left),
      y: Math.round(point.y / this.scale - this.top),
    };
  }

  get scale() {
    return this.zoom * this.dpi;
  }

  clear(): void {
    const { width, height } = this.canvas;

    this.ctx.fillStyle = this.container.theme.backgroundColour;
    this.ctx.fillRect(0, 0, width, height);
  }
}
