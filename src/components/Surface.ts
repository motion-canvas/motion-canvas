import {Container} from 'konva/lib/Container';
import {Rect} from 'konva/lib/shapes/Rect';
import {parseColor} from 'mix-color';
import {LayoutGroup, LayoutGroupConfig} from './LayoutGroup';
import {Origin, Size} from '../types';
import {
  getClientRect,
  getOriginDelta,
  getOriginOffset,
  LayoutNode,
} from './ILayoutNode';
import {CanvasHelper} from '../helpers';
import {Context} from 'konva/lib/Context';
import {easeOutExpo, linear, tween} from '../tweening';
import {GetSet, IRect} from 'konva/lib/types';
import {getset, threadable} from '../decorators';
import {Node} from 'konva/lib/Node';
import {Reference} from '../utils';

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

export interface SurfaceConfig extends LayoutGroupConfig {
  ref?: Reference<Surface>;
  radius?: number;
  origin?: Origin;
  circleMask?: CircleMask;
  background?: string;
  child?: LayoutNode;
}

export class Surface extends LayoutGroup {
  @getset(0, Surface.prototype.updateBackground)
  public radius: GetSet<SurfaceConfig['radius'], this>;
  @getset('#FF00FF', Surface.prototype.updateBackground)
  public background: GetSet<SurfaceConfig['background'], this>;
  @getset(null)
  public child: GetSet<SurfaceConfig['child'], this>;

  private readonly box: Rect;
  private readonly ripple: Rect;
  private surfaceMask: SurfaceMask | null = null;
  private circleMask: CircleMask | null = null;
  private layoutData: Size;

  public constructor(config?: SurfaceConfig) {
    super(config);
    this.ripple = new Rect({
      x: 0,
      y: 0,
      fill: '#242424',
      name: 'ripple',
      visible: false,
    });
    this.box = new Rect({
      x: 0,
      y: 0,
      fill: '#242424',
      name: 'box',
    });

    this.add(this.ripple, this.box);
    this.handleLayoutChange();
  }

  public setChild(value: LayoutNode): this {
    this.attrs.child?.remove();
    this.attrs.child = value;
    if (value) {
      this.add(value);
    }
    this.handleLayoutChange();

    return this;
  }

  public getChild<T extends LayoutNode>(): T {
    return <T>this.attrs.child;
  }

  public setCircleMask(value: CircleMask | null): this {
    this.circleMask = value;
    return this;
  }

  public getCircleMask(): CircleMask | null {
    return this.circleMask ?? null;
  }

  public clone(obj?: any): this {
    const child = this.child();
    this.child(null);
    const clone: this = Node.prototype.clone.call(this, obj);
    this.child(child);
    if (child) {
      clone.setChild(child.clone());
    }
    this.getChildren().forEach(node => {
      if (node !== child && node !== this.box && node !== this.ripple) {
        clone.add(node.clone());
      }
    });

    return clone;
  }

  getLayoutSize(custom?: SurfaceConfig): Size {
    return {
      width: this.surfaceMask?.width ?? this.layoutData?.width ?? 0,
      height: this.surfaceMask?.height ?? this.layoutData?.height ?? 0,
    };
  }

  @threadable()
  public *doRipple() {
    if (this.surfaceMask) return;
    const opaque = parseColor(this.background());
    this.ripple.show();
    this.ripple
      .offsetX(this.layoutData.width / 2)
      .offsetY(this.layoutData.height / 2)
      .width(this.layoutData.width)
      .height(this.layoutData.height)
      .cornerRadius(this.radius())
      .fill(`rgba(${opaque.r}, ${opaque.g}, ${opaque.b}, ${0.5})`);

    yield* tween(1, value => {
      const width = this.layoutData.width + easeOutExpo(value, 0, 100);
      const height = this.layoutData.height + easeOutExpo(value, 0, 100);
      const radius = this.radius() + easeOutExpo(value, 0, 50);

      this.ripple
        .offsetX(width / 2)
        .offsetY(height / 2)
        .width(width)
        .height(height)
        .cornerRadius(radius)
        .fill(
          `rgba(${opaque.r}, ${opaque.g}, ${opaque.b}, ${linear(
            value,
            0.5,
            0,
          )})`,
        );
    });

    this.ripple.hide();
  }

  public setMask(data: SurfaceMask) {
    if (data === null) {
      this.surfaceMask = null;
      this.handleLayoutChange();
      return;
    } else if (this.surfaceMask === null) {
      this.box
        .offsetX(5000)
        .offsetY(5000)
        .position({x: 0, y: 0})
        .width(10000)
        .height(100000);
    }

    const child = this.child();
    const newOffset = getOriginOffset(data, this.getOrigin());
    const contentSize = child.getLayoutSize();
    const contentMargin = child.getMargin();
    const scale = Math.min(
      1,
      data.width / (contentSize.width + contentMargin.x),
    );

    this.surfaceMask = data;
    this.offset(newOffset);
    child.scaleX(scale);
    child.scaleY(scale);
    child.position(getOriginDelta(data, Origin.Middle, child.getOrigin()));
    this.box.fill(data.color);
    this.fireLayoutChange();
  }

  public getMask(): SurfaceMask {
    return {
      ...this.layoutData,
      radius: this.radius(),
      color: this.background(),
    };
  }

  protected handleLayoutChange() {
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

    this.updateBox();
    this.updateBackground();
    this.setOrigin(this.getOrigin());
    this.fireLayoutChange();
  }

  private updateBox() {
    if (!this.box) return;
    const size = this.getLayoutSize();
    this.box
      .offsetX(size.width / 2)
      .offsetY(size.height / 2)
      .width(size.width)
      .height(size.height);
  }

  private updateBackground() {
    if (this.surfaceMask || !this.box) return;
    this.box.cornerRadius(this.radius()).fill(this.background());
  }

  private drawMask(ctx: Context) {
    if (this.surfaceMask) {
      const offset = this.offsetY();
      const newOffset = getOriginOffset(this.surfaceMask, this.getOrigin());
      CanvasHelper.roundRect(
        ctx,
        -this.surfaceMask.width / 2,
        -this.surfaceMask.height / 2 + offset - newOffset.y,
        this.surfaceMask.width,
        this.surfaceMask.height,
        this.surfaceMask.radius,
      );
      if (this.circleMask) {
        ctx._context.clip(this.drawCircleMask(new Path2D()));
      }
    } else {
      this.drawCircleMask(ctx);
    }
  }

  private drawCircleMask<T extends Context | Path2D>(ctx: T): T {
    const mask = this.circleMask;
    ctx.arc(mask.x, mask.y, mask.radius, 0, Math.PI * 2, false);
    return ctx;
  }

  public getClipFunc() {
    return this.circleMask || this.surfaceMask ? this.drawMask : null;
  }

  public getAbsoluteCircleMask(custom?: SurfaceConfig): CircleMask {
    const mask = custom?.circleMask ?? this.circleMask ?? null;
    if (mask === null) return null;
    const size = this.getLayoutSize(custom);
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

  getClientRect(config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Container;
  }): IRect {
    return getClientRect(this, config);
  }
}
