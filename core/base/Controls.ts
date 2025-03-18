import { ControlPointAction } from '../constants';
import { BradisTable } from '../utils';
import type { Container } from './Container';
import { ControlPoint } from './ControlPoint';
import type { Node } from './Node';

export class Controls {
  container: Container;
  parent: Node;
  active: boolean = true;
  rotateControl: ControlPoint;
  resizeTopControl: ControlPoint;
  resizeTopRightControl: ControlPoint;
  resizeRightControl: ControlPoint;
  resizeBottomRightControl: ControlPoint;
  resizeBottomControl: ControlPoint;
  resizeBottomLeftControl: ControlPoint;
  resizeLeftControl: ControlPoint;
  resizeTopLeftControl: ControlPoint;

  constructor(parent: Node, container: Container) {
    this.container = container;
    this.parent = parent;
    this.rotateControl = new ControlPoint(this, ControlPointAction.ROTATE);
    this.resizeTopControl = new ControlPoint(this, ControlPointAction.RESIZE_TOP);
    this.resizeTopRightControl = new ControlPoint(this, ControlPointAction.RESIZE_TOP_RIGHT);
    this.resizeRightControl = new ControlPoint(this, ControlPointAction.RESIZE_RIGHT);
    this.resizeBottomRightControl = new ControlPoint(this, ControlPointAction.RESIZE_BOTTOM_RIGHT);
    this.resizeBottomControl = new ControlPoint(this, ControlPointAction.RESIZE_BOTTOM);
    this.resizeBottomLeftControl = new ControlPoint(this, ControlPointAction.RESIZE_BOTTOM_LEFT);
    this.resizeLeftControl = new ControlPoint(this, ControlPointAction.RESIZE_LEFT);
    this.resizeTopLeftControl = new ControlPoint(this, ControlPointAction.RESIZE_TOP_LEFT);
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

  get x() {
    const padding = this.container.theme.controls.padding;
    return this.parent.x - padding;
  }

  get y() {
    const padding = this.container.theme.controls.padding;
    return this.parent.y - padding;
  }

  get left() {
    const padding = this.container.theme.controls.padding;
    return this.parent.left - padding;
  }

  get right() {
    const padding = this.container.theme.controls.padding;
    return this.parent.right + padding;
  }

  get top() {
    const padding = this.container.theme.controls.padding;
    return this.parent.top - padding;
  }

  get bottom() {
    const padding = this.container.theme.controls.padding;
    return this.parent.bottom + padding;
  }

  private getRotatedBoundingBox() {
    const rotation = this.parent.rotation;
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

  render() {
    if (this.active && this.visible) {
      const camera = this.container.camera;
      const ctx = camera.ctx;

      const parentRotation = this.parent.rotation;
      const radian = Math.PI / 180;
      const rotation = parentRotation * radian;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(rotation);
      ctx.translate(-this.parent.halfWidth, -this.parent.halfHeight);


      this.resizeTopControl.draw();
      this.resizeRightControl.draw();
      this.resizeBottomControl.draw();
      this.resizeLeftControl.draw();

      this.resizeTopRightControl.draw();
      this.resizeBottomRightControl.draw();
      this.resizeBottomLeftControl.draw();
      this.resizeTopLeftControl.draw();

      this.rotateControl.draw();

      ctx.restore();
    }
  }
}
