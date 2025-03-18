import { BradisTable, NodeHelper } from '../utils';
import type { Container } from './Container';

export class Node {
  id = NodeHelper.getID();
  protected readonly container: Container;
  parent: Node | null = null;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  halfWidth = 0;
  halfHeight = 0;
  rotation = 0;
  freeRotation = true;

  constructor(container: Container) {
    this.container = container;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setParent(parent: Node) {
    this.parent = parent;
    return this;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.halfWidth = width / 2;
    this.height = height;
    this.halfHeight = height / 2;
    return this;
  }

  setRotation(degrees: number) {
    this.rotation = ((Math.round(this.rotation + degrees) % 360) + 360) % 360;
    return this;
  }

  get left(): number {
    return this.x - this.halfWidth;
  }

  get right(): number {
    return this.x + this.halfWidth;
  }

  get top(): number {
    return this.y - this.halfHeight;
  }

  get bottom(): number {
    return this.y + this.halfHeight;
  }

  get visible(): boolean {
    const camera = this.container.camera;
    const canvas = camera.canvas;

    const box = this.getRotatedBoundingBox();

    const nodeLeft = (box.left + camera.left) * camera.scale;
    const nodeRight = (box.right + camera.left) * camera.scale;
    const nodeTop = (box.top + camera.top) * camera.scale;
    const nodeBottom = (box.bottom + camera.top) * camera.scale;

    const left = nodeLeft >= 0;
    const right = nodeRight <= canvas.width * camera.dpi;
    const top = nodeTop >= 0;
    const bottom = nodeBottom <= canvas.height * camera.dpi;

    return top && right && bottom && left;
  }

  private getRotatedBoundingBox() {
    const parentRotation = this.parent ? this.parent.rotation : 0;
    const rotation = this.rotation + parentRotation;

    switch (rotation) {
      case 0:
        return {
          left: this.left,
          top: this.top,
          right: this.right,
          bottom: this.bottom,
        };
      case 90:
        return {
          left: this.top,
          top: this.right,
          right: this.bottom,
          bottom: this.left,
        };
      case 180:
        return {
          left: this.right,
          top: this.bottom,
          right: this.left,
          bottom: this.top,
        };
      case 270:
        return {
          left: this.bottom,
          top: this.left,
          right: this.top,
          bottom: this.right,
        };
      default: {
        const { sin, cos } = BradisTable[rotation] || {
          sin: Math.sin(rotation),
          cos: Math.cos(rotation),
        };

        // Get the four corners of the node before rotation
        const corners = [
          { x: this.left, y: this.top },
          { x: this.right, y: this.top },
          { x: this.right, y: this.bottom },
          { x: this.left, y: this.bottom },
        ];

        let left = Infinity;
        let top = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;

        let rotatedX = null;
        let rotatedY = null;

        // Rotate each corner and find the bounding box
        corners.forEach((corner) => {
          rotatedX =
            cos * (corner.x - this.x) - sin * (corner.y - this.y) + this.x;
          rotatedY =
            sin * (corner.x - this.x) + cos * (corner.y - this.y) + this.y;

          left = Math.min(left, rotatedX);
          top = Math.min(top, rotatedY);
          right = Math.max(right, rotatedX);
          bottom = Math.max(bottom, rotatedY);

          rotatedX = null;
          rotatedY = null;
        });

        return { left, top, right, bottom };
      }
    }
  }

  public render() {
    if (this.visible) {
      const camera = this.container.camera;
      const ctx = camera.ctx;
      const box = camera.getProjectedBox(this);

      ctx.save();
      ctx.translate(box.x, box.y);

      if (this.freeRotation) {
        const parentRotation = this.parent ? this.parent.rotation : 0;
        const radian = Math.PI / 180;
        const rotation = (this.rotation + parentRotation) * radian;
        ctx.rotate(rotation);
      }

      ctx.translate(-box.width / 2, -box.height / 2);

      this.draw();

      ctx.restore();
    }
  }

  draw() {
    throw new Error('Not implemented');
  }

  public select(x: number, y: number): boolean {
    const { left, top, right, bottom } = this.getRotatedBoundingBox();

    return x >= left && x <= right && y >= top && y <= bottom;
  }
}
