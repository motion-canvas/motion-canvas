import {Node, NodeProps} from './Node';
import {Signal} from '@motion-canvas/core/lib/utils';
import {property} from '../decorators';
import {NodeChildren} from './types';

export interface RectProps extends NodeProps {
  children?: NodeChildren;
  fill: string;
}

export class Rect extends Node<RectProps> {
  @property('#ffffff')
  public declare readonly fill: Signal<string, this>;

  public override render(context: CanvasRenderingContext2D) {
    context.save();
    this.transformContext(context);

    const width = this.width();
    const height = this.height();

    context.save();
    context.fillStyle = this.fill();
    context.fillRect(-width / 2, -height / 2, width, height);
    context.restore();

    for (const child of this.children()) {
      child.render(context);
    }

    context.restore();
  }
}
