import {CanvasStyle} from '../partials';
import {computed, property} from '../decorators';
import {createSignal, Signal, SignalValue} from '@motion-canvas/core/lib/utils';
import {Rect} from '@motion-canvas/core/lib/types';
import {Layout, LayoutProps} from './Layout';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {easeOutExpo, linear, map} from '@motion-canvas/core/lib/tweening';
import {parseCanvasStyle} from '../utils';

export interface ShapeProps extends LayoutProps {
  fill?: SignalValue<CanvasStyle>;
  stroke?: SignalValue<CanvasStyle>;
  strokeFirst?: SignalValue<boolean>;
  lineWidth?: SignalValue<number>;
  lineJoin?: SignalValue<CanvasLineJoin>;
  lineCap?: SignalValue<CanvasLineCap>;
  lineDash?: SignalValue<number>[];
  lineDashOffset?: SignalValue<number>;
}

export abstract class Shape extends Layout {
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

  protected readonly rippleStrength = createSignal<number, this>(0);

  @computed()
  protected rippleSize() {
    return easeOutExpo(this.rippleStrength(), 0, 50);
  }

  public constructor(props: ShapeProps) {
    super(props);
  }

  protected applyStyle(context: CanvasRenderingContext2D) {
    context.fillStyle = parseCanvasStyle(this.fill(), context);
    context.strokeStyle = parseCanvasStyle(this.stroke(), context);
    context.lineWidth = this.lineWidth();
    context.lineJoin = this.lineJoin();
    context.lineCap = this.lineCap();
    context.setLineDash(this.lineDash());
    context.lineDashOffset = this.lineDashOffset();
  }

  protected override draw(context: CanvasRenderingContext2D) {
    this.drawShape(context);
    if (this.clip()) {
      context.clip(this.getPath());
    }
    this.drawChildren(context);
  }

  protected drawShape(context: CanvasRenderingContext2D) {
    const path = this.getPath();
    const hasStroke = this.lineWidth() > 0 && this.stroke() !== null;
    const hasFill = this.fill() !== null;
    context.save();
    this.applyStyle(context);
    this.drawRipple(context);
    if (this.strokeFirst()) {
      hasStroke && context.stroke(path);
      hasFill && context.fill(path);
    } else {
      hasFill && context.fill(path);
      hasStroke && context.stroke(path);
    }
    context.restore();
  }

  protected override getCacheRect(): Rect {
    return super.getCacheRect().expand(this.lineWidth() / 2);
  }

  protected getPath(): Path2D {
    return new Path2D();
  }

  protected getRipplePath(): Path2D {
    return new Path2D();
  }

  protected drawRipple(context: CanvasRenderingContext2D) {
    const rippleStrength = this.rippleStrength();
    if (rippleStrength > 0) {
      const ripplePath = this.getRipplePath();
      context.save();
      context.globalAlpha *= map(0.54, 0, rippleStrength);
      context.fill(ripplePath);
      context.restore();
    }
  }

  @threadable()
  public *ripple(duration = 1) {
    this.rippleStrength(0);
    yield* this.rippleStrength(1, duration, linear);
    this.rippleStrength(0);
  }
}
