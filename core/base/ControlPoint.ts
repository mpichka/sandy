import type { Controls } from './Controls';
import { ControlPointAction, type ControlPointActionType } from '../constants';

export class ControlPoint {
  controls: Controls;
  action: ControlPointActionType;

  constructor(controls: Controls, action: ControlPointActionType) {
    this.controls = controls;
    this.action = action;
  }

  draw() {
    const theme = this.controls.container.theme.controls;
    const parent = this.controls.parent;
    const camera = this.controls.container.camera;
    const ctx = camera.ctx;

    const doublePadding = theme.padding * 2;
    const diameter = theme.diameter * camera.dpi;
    const hypotenuse = diameter * Math.sqrt(2);
    const halfHypotenuse = hypotenuse / 2;

    ctx.strokeStyle = theme.strokeColour;
    ctx.fillStyle = theme.fillColour;
    ctx.beginPath();

    switch (this.action) {
      case ControlPointAction.ROTATE: {
        ctx.arc(
          parent.width / 2 + theme.padding,
          -theme.padding * 2,
          diameter,
          0,
          360,
        );
        break;
      }
      case ControlPointAction.RESIZE_TOP: {
        ctx.moveTo(0, 0);
        ctx.lineTo(parent.width + doublePadding, 0);
        break;
      }
      case ControlPointAction.RESIZE_TOP_RIGHT: {
        ctx.roundRect(
          parent.width + theme.padding * 2 - halfHypotenuse,
          -halfHypotenuse,
          hypotenuse,
          hypotenuse,
          10
        );
        break;
      }
      case ControlPointAction.RESIZE_RIGHT: {
        const x = parent.width + theme.padding * 2;
        const y = parent.height + theme.padding * 2;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y);
        break;
      }
      case ControlPointAction.RESIZE_BOTTOM_RIGHT: {
        ctx.rect(
          -halfHypotenuse,
          parent.height + theme.padding * 2 - halfHypotenuse,
          hypotenuse,
          hypotenuse,
        );
        break;
      }
      case ControlPointAction.RESIZE_BOTTOM: {
        const x = parent.width + theme.padding * 2;
        const y = parent.height + theme.padding * 2;
        ctx.moveTo(x, y);
        ctx.lineTo(0, y);
        break;
      }
      case ControlPointAction.RESIZE_BOTTOM_LEFT: {
        ctx.rect(
          parent.width + theme.padding * 2 - halfHypotenuse,
          parent.height + theme.padding * 2 - halfHypotenuse,
          hypotenuse,
          hypotenuse,
        );
        break;
      }
      case ControlPointAction.RESIZE_LEFT: {
        const x = 0;
        const y = parent.height + theme.padding * 2;
        ctx.moveTo(x, y);
        ctx.lineTo(x, 0);
        break;
      }
      case ControlPointAction.RESIZE_TOP_LEFT: {
        ctx.rect(-halfHypotenuse, -halfHypotenuse, hypotenuse, hypotenuse);
        break;
      }
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
