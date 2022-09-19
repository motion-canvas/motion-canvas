import {Node, NodeProps} from './Node';
import {Gradient, Pattern} from '../partials';
import {compound, property} from '../decorators';
import {Signal} from '@motion-canvas/core/lib/utils';
import {Vector2} from '@motion-canvas/core/lib/types';
import {vector2dLerp} from '@motion-canvas/core/lib/tweening';

export type CanvasStyle = null | string | Gradient | Pattern;

export interface ShapeProps extends NodeProps {
  fill?: CanvasStyle;
  stroke?: CanvasStyle;
  lineWidth?: number;
  lineJoin?: CanvasLineJoin;
  lineCap?: CanvasLineCap;
  lineDash?: number[];
  lineDashOffset?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOffset?: Vector2;
}

export abstract class Shape<T extends ShapeProps = ShapeProps> extends Node<T> {
  @property(null)
  public declare readonly fill: Signal<CanvasStyle, this>;
  @property(null)
  public declare readonly stroke: Signal<CanvasStyle, this>;
  @property(0)
  public declare readonly lineWidth: Signal<number, this>;
  @property('miter')
  public declare readonly lineJoin: Signal<CanvasLineJoin, this>;
  @property('butt')
  public declare readonly lineCap: Signal<CanvasLineCap, this>;
  @property([])
  public declare readonly lineDash: Signal<number[], this>;
  @property(0)
  public declare readonly lineDashOffset: Signal<number, this>;
  @property('')
  public declare readonly shadowColor: Signal<string, this>;
  @property(0)
  public declare readonly shadowBlur: Signal<number, this>;
  @property(0)
  public declare readonly shadowOffsetX: Signal<number, this>;
  @property(0)
  public declare readonly shadowOffsetY: Signal<number, this>;
  @compound({x: 'shadowOffsetX', y: 'shadowOffsetY'})
  @property(undefined, vector2dLerp)
  public declare readonly shadowOffset: Signal<Vector2, this>;

  protected parseCanvasStyle(
    style: CanvasStyle,
    context: CanvasRenderingContext2D,
  ): string | CanvasGradient | CanvasPattern {
    if (style === null) {
      return '';
    }
    if (typeof style === 'string') {
      return style;
    }
    if (style instanceof Gradient) {
      return style.canvasGradient(context);
    }
    return style.canvasPattern(context) ?? '';
  }

  protected applyFill(context: CanvasRenderingContext2D) {
    context.fillStyle = this.parseCanvasStyle(this.fill(), context);
    context.shadowColor = this.shadowColor();
    context.shadowBlur = this.shadowBlur();
    context.shadowOffsetX = this.shadowOffsetX();
    context.shadowOffsetY = this.shadowOffsetY();
  }

  protected applyStroke(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.parseCanvasStyle(this.stroke(), context);
    context.lineWidth = this.lineWidth();
    context.lineJoin = this.lineJoin();
    context.lineCap = this.lineCap();
    context.setLineDash(this.lineDash());
    context.lineDashOffset = this.lineDashOffset();
  }

  public override render(context: CanvasRenderingContext2D) {
    context.save();
    this.transformContext(context);

    const path = this.getPath();
    context.save();
    this.applyFill(context);
    context.fill(path);
    context.restore();
    context.save();
    this.applyStroke(context);
    context.stroke(path);
    context.restore();

    for (const child of this.children()) {
      child.render(context);
    }

    context.restore();
  }

  protected abstract getPath(): Path2D;
}
