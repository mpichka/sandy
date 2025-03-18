import type { Box, DeviceSettings, Point } from '../interfaces';
import type { Container } from './Container';
import type { Node } from './Node';

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
  MIN_ZOOM = 0.1;
  MAX_ZOOM = 2;

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

  public setZoom(value: number, point?: Point) {
    let zoom: number;
    let x: number;
    let y: number;

    if (point) {
      zoom = Number((this.zoom + value / 100).toFixed(2));
      x = point.x;
      y = point.y;
    } else {
      zoom = Number((value / 100).toFixed(2));
      x = (this.right - this.left) / 2;
      y = (this.bottom - this.top) / 2;
    }

    if (zoom >= this.MIN_ZOOM && zoom <= this.MAX_ZOOM) {
      const beforeX = this.left + x / this.zoom;
      const beforeY = this.top + y / this.zoom;

      this.zoom = zoom;

      const afterX = this.left + x / this.zoom;
      const afterY = this.top + y / this.zoom;

      this.left -= beforeX - afterX;
      this.top -= beforeY - afterY;
      this.right = this.left + this.canvas.width / this.zoom;
      this.bottom = this.top + this.canvas.height / this.zoom;
    }
  }

  public getProjectedBox(node: Node): Box {
    return {
      x: (node.x + this.left) * this.scale,
      y: (node.y + this.top) * this.scale,
      width: node.width * this.scale,
      height: node.height * this.scale,
    };
  }
}
