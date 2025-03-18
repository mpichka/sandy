import { Node, Palette } from '../base';
import { Container } from '../base/Container';

export class Cell extends Node {
  protected palette: Palette;
  colorUID: number = Infinity;

  constructor(container: Container, palette: Palette) {
    super(container);
    this.palette = palette;
  }

  setColor(colorUID: number) {
    this.colorUID = colorUID;
    return this;
  }

  draw() {
    const camera = this.container.camera;
    const ctx = camera.ctx;

    const color = this.palette.getColor(this.colorUID);

    if (!color) return;

    ctx.fillStyle = color.hex;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
