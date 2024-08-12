import {
  BBox,
  SignalValue,
  SimpleSignal,
  createSignal,
  easeOutExpo,
  linear,
  map,
  threadable,
} from '@motion-canvas/core';
import {computed, initial, nodeName, signal} from '../decorators';
import {
  CanvasStyleSignal,
  canvasStyleSignal,
} from '../decorators/canvasStyleSignal';
import {PossibleCanvasStyle} from '../partials';
import {resolveCanvasStyle} from '../utils';
import {Layout, LayoutProps} from './Layout';

export interface ShapeProps extends LayoutProps {
  fill?: SignalValue<PossibleCanvasStyle>;
  stroke?: SignalValue<PossibleCanvasStyle>;
  strokeFirst?: SignalValue<boolean>;
  lineWidth?: SignalValue<number>;
  lineJoin?: SignalValue<CanvasLineJoin>;
  lineCap?: SignalValue<CanvasLineCap>;
  lineDash?: SignalValue<number[]>;
  lineDashOffset?: SignalValue<number>;
  antialiased?: SignalValue<boolean>;
}

@nodeName('Shape')
export abstract class Shape extends Layout {
  @canvasStyleSignal()
  public declare readonly fill: CanvasStyleSignal<this>;
  @canvasStyleSignal()
  public declare readonly stroke: CanvasStyleSignal<this>;
  @initial(false)
  @signal()
  public declare readonly strokeFirst: SimpleSignal<boolean, this>;
  @initial(0)
  @signal()
  public declare readonly lineWidth: SimpleSignal<number, this>;
  @initial('miter')
  @signal()
  public declare readonly lineJoin: SimpleSignal<CanvasLineJoin, this>;
  @initial('butt')
  @signal()
  public declare readonly lineCap: SimpleSignal<CanvasLineCap, this>;
  @initial([])
  @signal()
  public declare readonly lineDash: SimpleSignal<number[], this>;
  @initial(0)
  @signal()
  public declare readonly lineDashOffset: SimpleSignal<number, this>;
  @initial(true)
  @signal()
  public declare readonly antialiased: SimpleSignal<boolean, this>;

  protected readonly rippleStrength = createSignal<number, this>(0);

  @computed()
  protected rippleSize() {
    return easeOutExpo(this.rippleStrength(), 0, 50);
  }

  public constructor(props: ShapeProps) {
    super(props);
  }

  protected applyText(context: CanvasRenderingContext2D) {
    context.direction = this.textDirection();
    this.element.dir = this.textDirection();
  }

  protected applyStyle(context: CanvasRenderingContext2D) {
    context.fillStyle = resolveCanvasStyle(this.fill(), context);
    context.strokeStyle = resolveCanvasStyle(this.stroke(), context);
    context.lineWidth = this.lineWidth();
    context.lineJoin = this.lineJoin();
    context.lineCap = this.lineCap();
    context.setLineDash(this.lineDash());
    context.lineDashOffset = this.lineDashOffset();
    if (!this.antialiased()) {
      // from https://stackoverflow.com/a/68372384
      context.filter =
        'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)';
    }
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

  protected override getCacheBBox(): BBox {
    return super.getCacheBBox().expand(this.lineWidth() / 2);
  }

  @computed()
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
