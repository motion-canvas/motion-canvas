import {Group} from 'konva/lib/Group';
import {ContainerConfig} from 'konva/lib/Container';
import {Rect} from 'konva/lib/shapes/Rect';
import {Shape} from 'konva/lib/Shape';
import {parseColor} from 'mix-color';
import {Project} from '../Project';
import {LayoutGroup} from './LayoutGroup';
import {Origin, Size} from '../types';
import {getOriginDelta, getOriginOffset, isLayoutNode, LayoutAttrs, LayoutNode} from './ILayoutNode';
import {CanvasHelper} from "../helpers";

export type LayoutData = LayoutAttrs & Size;
export interface SurfaceMask {
  width: number;
  height: number;
  radius: number;
  color: string;
}

export interface SurfaceConfig extends ContainerConfig {
  origin?: Origin;
}

export class Surface extends LayoutGroup {
  private box: Rect;
  private ripple: Rect;
  private child: LayoutNode;
  private override: boolean = false;
  private mask: SurfaceMask = null;
  private layoutData: LayoutData;

  public constructor(config?: SurfaceConfig) {
    super(config);
    this.add(
      new Rect({
        x: 0,
        y: 0,
        fill: '#242424',
        name: 'ripple',
        visible: false,
      }),
    );
    this.add(
      new Rect({
        x: 0,
        y: 0,
        fill: '#242424',
        name: 'box',
      }),
    );
  }

  getLayoutSize(): Size {
    return this.override && this.mask
      ? {
          width: this.mask?.width ?? 0,
          height: this.mask?.height ?? 0,
        }
      : {
          width: this.layoutData?.width ?? 0,
          height: this.layoutData?.height ?? 0,
        };
  }

  add(...children: (Shape | Group)[]): this {
    super.add(...children);
    const child = children.find<LayoutNode>(isLayoutNode);
    const ripple = children.find<Rect>((child): child is Rect =>
      child.hasName('ripple'),
    );
    const box = children.find<Rect>((child): child is Rect =>
      child.hasName('box'),
    );

    if (box) {
      this.box?.destroy();
      this.box = box;
    }
    if (ripple) {
      this.ripple?.destroy();
      this.ripple = ripple;
    }

    if (child) {
      this.child = child;
      this.handleLayoutChange();
    }

    return this;
  }

  public get project(): Project {
    return <Project>this.getStage();
  }

  public *doRipple() {
    if (this.override) return;
    const opaque = parseColor(this.layoutData.color);
    this.ripple.show();
    this.ripple
      .offsetX(this.layoutData.width / 2)
      .offsetY(this.layoutData.height / 2)
      .width(this.layoutData.width)
      .height(this.layoutData.height)
      .cornerRadius(this.layoutData.radius)
      .fill(`rgba(${opaque.r}, ${opaque.g}, ${opaque.b}, ${0.5})`);

    yield* this.project.tween(1, value => {
      const width = this.layoutData.width + value.easeOutExpo(0, 100);
      const height = this.layoutData.height + value.easeOutExpo(0, 100);
      const radius = this.layoutData.radius + value.easeOutExpo(0, 50);

      this.ripple
        .offsetX(width / 2)
        .offsetY(height / 2)
        .width(width)
        .height(height)
        .cornerRadius(radius)
        .fill(
          `rgba(${opaque.r}, ${opaque.g}, ${opaque.b}, ${value.linear(
            0.5,
            0,
          )})`,
        );
    });

    this.ripple.hide();
  }

  public getChild(): LayoutNode {
    return this.child;
  }

  public setOverride(value: boolean) {
    this.override = value;
    this.clipFunc(value ? this.drawMask : null);
    if (!value) {
      this.handleLayoutChange();
    } else {
      this.box
        .offsetX(5000)
        .offsetY(5000)
        .position({x: 0, y: 0})
        .width(10000)
        .height(100000);
    }
  }

  public setMask(data: SurfaceMask) {
    const newOffset = getOriginOffset(data, this.getOrigin());
    const contentSize = this.child.getLayoutSize();
    const contentMargin = this.child.getMargin();
    const scale = Math.min(
      1,
      data.width / (contentSize.width + contentMargin * 2),
    );

    this.mask = data;
    this.offset(newOffset);
    this.child.scaleX(scale);
    this.child.scaleY(scale);
    this.child.position(
      getOriginDelta(data, Origin.Middle, this.child.getOrigin()),
    );
    this.box.fill(data.color);
    this.fireLayoutChange();
  }

  public getMask(): SurfaceMask {
    return this.layoutData;
  }

  protected handleLayoutChange() {
    if (this.override) return;

    this.layoutData ??= {
      origin: Origin.Middle,
      color: '#F0F',
      height: 0,
      width: 0,
      padding: 0,
      margin: 0,
      radius: 0,
    };

    this.layoutData.origin = this.getOrigin();
    if (this.child) {
      const size = this.child.getLayoutSize();
      const margin = this.child.getMargin();
      const scale = this.child.getAbsoluteScale(this);
      const padding = this.getPadding();

      this.layoutData = {
        ...this.layoutData,
        width: (size.width + margin * 2 + padding * 2) * scale.x,
        height: (size.height + margin * 2 + padding * 2) * scale.y,
        radius: this.child.getRadius(),
        color: this.child.getColor(),
      };

      this.child.position(
        getOriginDelta(
          this.getLayoutSize(),
          Origin.Middle,
          this.child.getOrigin(),
        ),
      );
    }

    this.updateBackground(this.layoutData);
    this.setOrigin(this.getOrigin());
    this.fireLayoutChange();
  }

  private updateBackground(data: LayoutData) {
    if (this.box) {
      this.box
        .offsetX(data.width / 2)
        .offsetY(data.height / 2)
        .width(data.width)
        .height(data.height)
        .cornerRadius(data.radius)
        .fill(data.color);
    }
  }

  private drawMask(ctx: CanvasRenderingContext2D) {
    const offset = this.offsetY();
    const newOffset = getOriginOffset(this.mask, this.getOrigin());

    CanvasHelper.roundRect(
      ctx,
      -this.mask.width / 2,
      -this.mask.height / 2 + offset - newOffset.y,
      this.mask.width,
      this.mask.height,
      this.mask.radius,
    );
  }
}
