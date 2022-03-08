import {Shape, ShapeConfig} from 'konva/lib/Shape';
import {Node} from 'konva/lib/Node';
import {Context} from 'konva/lib/Context';

export interface DebugConfig extends ShapeConfig {
  target: Node;
}

export class Debug extends Shape<DebugConfig> {
  public constructor(config?: DebugConfig) {
    super({
      strokeWidth: 2,
      stroke: 'red',
      ...config,
    });
  }

  public getTarget(): Node {
    return this.attrs.target;
  }

  _sceneFunc(context: Context) {
    const rect = this.getTarget().getClientRect({relativeTo: this.getLayer()});
    const position = this.getTarget().getAbsolutePosition(this.getLayer());

    context.rect(rect.x, rect.y, rect.width, rect.height);
    context.moveTo(position.x, position.y);
    context.arc(position.x, position.y, 4, 0, Math.PI * 2, false);
    context.fillStrokeShape(this);
  }
}
