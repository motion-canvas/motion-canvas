import {Node, NodeProps} from './Node';
import {Gradient, Pattern} from '../partials';
import {compound, computed, property} from '../decorators';
import {Signal} from '@motion-canvas/core/lib/utils';
import {Vector2, Rect, rect} from '@motion-canvas/core/lib/types';
import {vector2dLerp} from '@motion-canvas/core/lib/tweening';

export type CanvasStyle = null | string | Gradient | Pattern;

export interface ShapeProps extends NodeProps {
  fill?: CanvasStyle;
  stroke?: CanvasStyle;
  strokeFirst?: boolean;
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
  @property(false)
  public declare readonly strokeFirst: Signal<boolean, this>;
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

  @computed()
  protected hasShadow(): boolean {
    return (
      !!this.shadowColor() ||
      !!this.shadowOffsetX() ||
      !!this.shadowOffsetY() ||
      !!this.shadowBlur()
    );
  }

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

  protected applyShadow(context: CanvasRenderingContext2D) {
    // TODO Consider accounting for transparency when drawing from cache.
    context.shadowColor = this.shadowColor();
    context.shadowBlur = this.shadowBlur();
    context.shadowOffsetX = this.shadowOffsetX();
    context.shadowOffsetY = this.shadowOffsetY();
  }

  protected applyStyle(context: CanvasRenderingContext2D) {
    context.fillStyle = this.parseCanvasStyle(this.fill(), context);
    context.strokeStyle = this.parseCanvasStyle(this.stroke(), context);
    context.lineWidth = this.lineWidth();
    context.lineJoin = this.lineJoin();
    context.lineCap = this.lineCap();
    context.setLineDash(this.lineDash());
    context.lineDashOffset = this.lineDashOffset();
  }

  protected override draw(context: CanvasRenderingContext2D, cache = false) {
    const path = this.getPath();
    context.save();
    this.applyStyle(context);
    if (!cache) {
      this.applyShadow(context);
    }
    if (this.strokeFirst()) {
      context.stroke(path);
      context.fill(path);
    } else {
      context.fill(path);
      context.stroke(path);
    }
    context.restore();

    super.draw(context, cache);
  }

  protected requiresCache(): boolean {
    const hasCompositeEffect = this.opacity() < 1 || this.hasShadow();
    let separateComponents = this.children().length;
    if (this.stroke()) {
      separateComponents++;
    }
    if (this.fill()) {
      separateComponents++;
    }

    return this.cache() || (hasCompositeEffect && separateComponents > 1);
  }

  protected override setupDrawFromCache(context: CanvasRenderingContext2D) {
    this.applyShadow(context);
    super.setupDrawFromCache(context);
  }

  protected override getCacheRect(): Rect {
    return rect.expand(super.getCacheRect(), this.lineWidth() / 2);
  }

  protected abstract getPath(): Path2D;
}
