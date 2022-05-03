import {Context} from 'konva/lib/Context';
import {GetSet} from 'konva/lib/types';
import {LayoutShape, LayoutShapeConfig} from './LayoutShape';
import {KonvaNode, getset} from '../decorators';
import {CanvasHelper} from '../helpers';

export interface GridConfig extends LayoutShapeConfig {
  gridSize?: number;
  subdivision?: boolean;
  checker?: boolean;
}

@KonvaNode()
export class Grid extends LayoutShape {
  @getset(16, Grid.prototype.recalculate)
  public gridSize: GetSet<number, this>;
  @getset(false)
  public checker: GetSet<GridConfig['checker'], this>;

  @getset(false)
  public subdivision: GetSet<GridConfig['subdivision'], this>;

  private path: Path2D;
  private checkerPath: Path2D;

  public constructor(config?: GridConfig) {
    super(config);
    this._strokeFunc = context => {
      if (!this.path) this.recalculate();
      context.stroke(this.path);

      if (this.subdivision()) {
        const offset = this.gridSize() / 2;
        const dash = offset / 8;
        context.setLineDash([
          0,
          dash / 2,
          dash,
          dash,
          dash,
          dash,
          dash,
          dash,
          dash / 2,
        ]);
        context.translate(offset, offset);
        context.stroke(this.path);
      }
    };
    this._fillFunc = context => {
      if (!this.checkerPath) this.recalculate();
      const size = this.size();
      context._context.clip(
        CanvasHelper.roundRectPath(
          new Path2D(),
          size.width / -2,
          size.height / -2,
          size.width,
          size.height,
          8,
        ),
      );
      context.fill(this.checkerPath);
    };
  }

  private recalculate() {
    this.path = new Path2D();
    this.checkerPath = new Path2D();

    let gridSize = this.gridSize();
    if (gridSize < 1) {
      console.warn('Too small grid size: ', gridSize);
      gridSize = 1;
    }
    const size = this.getSize();
    size.width = size.width / 2 + gridSize;
    size.height = size.height / 2 + gridSize;

    let i = 0;
    for (let x = -size.width; x <= size.width; x += gridSize) {
      this.path.moveTo(x, -size.height);
      this.path.lineTo(x, size.height);

      for (
        let y = -size.height + (i % 2 ? 0 : gridSize);
        y <= size.height;
        y += gridSize * 2
      ) {
        this.checkerPath.rect(x, y, gridSize, gridSize);
        this.checkerPath.rect(x, y, gridSize, gridSize);
      }
      i++;
    }

    for (let y = -size.height; y <= size.height; y += gridSize) {
      this.path.moveTo(-size.width, y);
      this.path.lineTo(size.width, y);
    }
  }

  public _sceneFunc(context: Context) {
    if (this.checker()) {
      context.fillShape(this);
    } else {
      context.strokeShape(this);
    }
  }
}
