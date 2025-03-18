import { Camera } from './Camera';
import { Node } from './Node';
import { Palette } from './Palette';
import { Theme } from './Theme';

export class Container {
  camera!: Camera;
  palette!: Palette;
  theme!: Theme;
  nodes: Node[] = [];
}
