import {Node, NodeProps} from './Node';
import {Signal} from '@motion-canvas/core/lib/utils';
import {property} from '../decorators';
import {NodeChildren} from './types';

export interface CircleProps extends NodeProps {
  children?: NodeChildren;
  fill?: string;
}

export class Circle extends Node<CircleProps> {
  @property('#ffffff')
  public declare readonly fill: Signal<string, this>;

  public override render(context: CanvasRenderingContext2D) {
    context.save();
    this.transformContext(context);

    context.save();
    context.fillStyle = this.fill();
    context.beginPath();
    context.ellipse(
      0,
      0,
      this.width() / 2,
      this.height() / 2,
      0,
      0,
      Math.PI * 2,
    );
    context.closePath();
    context.fill();
    context.restore();

    for (const child of this.children) {
      child.render(context);
    }

    context.restore();
  }
}
