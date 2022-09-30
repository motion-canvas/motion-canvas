import {ContainerConfig} from 'konva/lib/Container';
import {Origin} from '@motion-canvas/core/lib/types';
import {getOriginDelta, Size} from '../types';
import {CanvasHelper} from '../helpers';
import {easeOutExpo, linear, tween} from '@motion-canvas/core/lib/tweening';
import {GetSet} from 'konva/lib/types';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {KonvaNode, getset} from '../decorators';
import {Node} from 'konva/lib/Node';
import {Reference} from '@motion-canvas/core/lib/utils';
import {Group} from 'konva/lib/Group';
import {Shape} from 'konva/lib/Shape';
import {Canvas} from 'konva/lib/Canvas';

export interface SurfaceMask {
  width: number;
  height: number;
  radius: number;
  color: string;
}

export interface CircleMask {
  radius: number;
  x: number;
  y: number;
}

export interface SurfaceConfig extends ContainerConfig {
  ref?: Reference<Surface>;
  radius?: number;
  circleMask?: CircleMask;
  background?: string;
  child?: Node;
  rescaleChild?: boolean;
  shadow?: boolean;
  overflow?: boolean;
}

@KonvaNode()
export class Surface extends Group {
  @getset(8)
  public radius: GetSet<SurfaceConfig['radius'], this>;
  @getset('#00000000')
  public background: GetSet<SurfaceConfig['background'], this>;
  @getset(null)
  public child: GetSet<SurfaceConfig['child'], this>;
  @getset(true)
  public rescaleChild: GetSet<SurfaceConfig['rescaleChild'], this>;
  @getset(false)
  public shadow: GetSet<SurfaceConfig['shadow'], this>;
  @getset(false)
  public overflow: GetSet<SurfaceConfig['overflow'], this>;

  private surfaceMask: SurfaceMask | null = null;
  private circleMask: CircleMask | null = null;
  private layoutData: Size;
  private rippleTween = 0;

  public constructor(config?: SurfaceConfig) {
    super(config);
    this.markDirty();
  }

  public setChild(value: Shape | Group): this {
    this.attrs.child?.remove();
    this.attrs.child = value;
    if (value) {
      this.add(value);
    }
    this.markDirty();

    return this;
  }

  public getChild<T extends Node>(): T {
    return <T>this.attrs.child;
  }

  public setCircleMask(value: CircleMask | null): this {
    this.circleMask = value;
    return this;
  }

  public getCircleMask(): CircleMask | null {
    return this.circleMask ?? null;
  }

  public clone(obj?: unknown): this {
    const child = this.child();
    this.child(null);
    const clone: this = Node.prototype.clone.call(this, obj);
    this.child(child);
    if (child) {
      clone.setChild(child.clone());
    }
    this.getChildren().forEach(node => {
      if (node !== child) {
        clone.add(node.clone());
      }
    });

    return clone;
  }

  public getLayoutSize(): Size {
    return {
      width: this.surfaceMask?.width ?? this.layoutData?.width ?? 0,
      height: this.surfaceMask?.height ?? this.layoutData?.height ?? 0,
    };
  }

  /**
   * @deprecated Use {@link ripple} instead.
   */
  public doRipple() {
    return this.ripple();
  }

  @threadable()
  public *ripple() {
    if (this.surfaceMask) return;
    yield* tween(1, value => {
      this.rippleTween = value;
    });
    this.rippleTween = 0;
  }

  public setMask(data: SurfaceMask) {
    if (data === null) {
      this.surfaceMask = null;
      this.markDirty();
      return;
    }

    const child = this.child();
    const contentSize = child.getLayoutSize();
    const contentMargin = child.getMargin();
    const scale = Math.min(
      1,
      data.width / (contentSize.width + contentMargin.x),
    );

    this.surfaceMask = data;
    if (this.rescaleChild()) {
      child.scaleX(scale);
      child.scaleY(scale);
    }
    child.position(getOriginDelta(data, Origin.Middle, child.getOrigin()));
    this.markDirty();
  }

  public getMask(): SurfaceMask {
    return {
      ...this.layoutData,
      radius: this.radius(),
      color: this.background(),
    };
  }

  public recalculateLayout() {
    if (this.surfaceMask) return;

    this.layoutData ??= {
      width: 0,
      height: 0,
    };

    const child = this.child();
    if (child) {
      const size = child.getLayoutSize();
      const margin = child.getMargin();
      const scale = child.getAbsoluteScale(this);
      const padding = this.getPadd();

      this.layoutData = {
        width: (size.width + margin.x + padding.x) * scale.x,
        height: (size.height + margin.y + padding.y) * scale.y,
      };

      const offset = child.getOriginDelta(Origin.Middle);
      child.position({
        x: -offset.x,
        y: -offset.y,
      });
    }

    super.recalculateLayout();
  }

  public _drawChildren(drawMethod: string, canvas: Canvas, top: Node): void {
    const context = canvas && canvas.getContext();

    context.save();
    const transform = this.getAbsoluteTransform(top);
    let m = transform.getMatrix();
    context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    const opacity = this.getAbsoluteOpacity();

    const size = this.surfaceMask ?? this.layoutData;
    const radius = this.surfaceMask?.radius ?? this.radius();
    if (this.rippleTween > 0) {
      const width = size.width + easeOutExpo(this.rippleTween, 0, 100);
      const height = size.height + easeOutExpo(this.rippleTween, 0, 100);
      const rippleRadius = radius + easeOutExpo(this.rippleTween, 0, 50);

      context.save();
      context._context.fillStyle = this.surfaceMask?.color ?? this.background();
      context._context.globalAlpha = linear(this.rippleTween, opacity / 2, 0);
      CanvasHelper.roundRect(
        context._context,
        -width / 2,
        -height / 2,
        width,
        height,
        rippleRadius,
      );
      context._context.fill();
      context.restore();
    }

    if (this.circleMask) {
      context._context.beginPath();
      context._context.arc(
        this.circleMask.x,
        this.circleMask.y,
        this.circleMask.radius,
        0,
        Math.PI * 2,
      );
      context._context.closePath();
      context._context.clip();
    }

    context.save();
    context._context.fillStyle = this.surfaceMask?.color ?? this.background();
    context._context.globalAlpha = opacity;
    if (this.shadow()) {
      context._context.shadowColor = 'rgba(0, 0, 0, 0.32)';
      context._context.shadowOffsetY = 10;
      context._context.shadowBlur = 40;
    }

    const path = CanvasHelper.roundRectPath(
      new Path2D(),
      -size.width / 2,
      -size.height / 2,
      size.width,
      size.height,
      radius,
    );
    context._context.fill(path);
    context.restore();

    if (!this.overflow() || this.surfaceMask) {
      context._context.clip(path);
    }

    m = transform.copy().invert().getMatrix();
    context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);

    super._drawChildren(drawMethod, canvas, top);

    context.restore();
  }

  public getAbsoluteCircleMask(custom?: SurfaceConfig): CircleMask {
    const mask = custom?.circleMask ?? this.circleMask ?? null;
    if (mask === null) return null;
    const size = this.getLayoutSize();
    const position = {
      x: (size.width * mask.x) / 2,
      y: (size.height * mask.y) / 2,
    };
    const farthestEdge = {
      x: Math.abs(position.x) + size.width / 2,
      y: Math.abs(position.y) + size.height / 2,
    };
    const distance = Math.sqrt(
      farthestEdge.x * farthestEdge.x + farthestEdge.y * farthestEdge.y,
    );

    return {
      ...position,
      radius: distance * mask.radius,
    };
  }
}
