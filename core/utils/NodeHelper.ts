import { Point } from '../interfaces';

export class NodeHelper {
  static counter = 0;
  static getID() {
    return ++NodeHelper.counter;
  }

  static getKey(point: Point) {
    return `${point.x}:${point.y}`;
  }
}
