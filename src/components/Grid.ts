import {Context} from 'konva/lib/Context';
import {GetSet} from 'konva/lib/types';
import {LayoutShape, LayoutShapeConfig} from './LayoutShape';
import {KonvaNode, getset} from '../decorators';

export interface GridConfig extends LayoutShapeConfig {
  gridSize?: number;
}

@KonvaNode()
export class Grid extends LayoutShape {
  @getset(16, Grid.prototype.recalculate)
  public gridSize: GetSet<number, this>;

  private path: Path2D;

  public constructor(config?: GridConfig) {
    super(config);
    this._strokeFunc = context => {
      if (!this.path) this.recalculate();
      context.stroke(this.path);
    };
  }

  private recalculate() {
    this.path = new Path2D();

    const gridSize = this.gridSize();
    const size = this.getSize();
    size.width /= 2;
    size.height /= 2;

    for (let x = -size.width; x <= size.width; x += gridSize) {
      this.path.moveTo(x, -size.height);
      this.path.lineTo(x, size.height);
    }

    for (let y = -size.height; y <= size.height; y += gridSize) {
      this.path.moveTo(-size.width, y);
      this.path.lineTo(size.width, y);
    }
  }

  public _sceneFunc(context: Context) {
    context.strokeShape(this);
  }
}
