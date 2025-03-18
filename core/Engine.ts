import { Camera, type Node, Palette } from './base';
import { Container } from './base/Container';
import { Theme } from './base/Theme';

export class Engine {
  container!: Container;
  isInitialized = false;

  public init(canvas: HTMLCanvasElement) {
    this.container = new Container();
    this.container.camera = new Camera(this.container, canvas);
    this.container.palette = new Palette();
    this.container.theme = new Theme();
    this.isInitialized = true;
  }

  public render() {
    this.container.camera.clear();
    this.container.nodes.forEach((node) => node.render());
  }

  addNode(node: Node) {
    this.container.nodes.push(node);
  }

  deleteNode(id: number) {
    this.container.nodes = this.container.nodes.filter(
      (node) => node.id !== id,
    );
  }

  findNodeByCoordinates(x: number, y: number) {
    return this.container.nodes.find((node) => node.select(x, y));
  }
}
