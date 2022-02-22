import {Group} from 'konva/lib/Group';
import {Container, ContainerConfig} from 'konva/lib/Container';
import {Rect} from 'konva/lib/shapes/Rect';
import {Shape} from 'konva/lib/Shape';
import {GetSet, IRect, Vector2d} from 'konva/lib/types';
import {SceneContext} from 'konva/lib/Context';
import {Direction, Origin} from 'MC/types/Origin';
import {Factory} from 'konva/lib/Factory';
import {_registerNode} from 'konva/lib/Global';
import {parseColor} from 'mix-color';
import {Project} from 'MC/Project';

export const SURFACE_CHANGE_EVENT = 'surfaceChange';

export type SurfaceData = IRect & {
  radius: number;
  color: string;
};

function roundRect(
  ctx: CanvasRenderingContext2D | SceneContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export interface ISurfaceChild {
  getSurfaceData(): SurfaceData;
}

function isSurfaceChild(
  node: Shape | Group | ISurfaceChild,
): node is (Shape | Group) & ISurfaceChild {
  return 'getSurfaceData' in node;
}

export interface SurfaceConfig extends ContainerConfig {
  origin?: Origin;
}

export class Surface extends Group {
  private box: Rect;
  private ripple: Rect;
  private child: (Shape | Group) & ISurfaceChild;
  private override: boolean;
  private surfaceData: SurfaceData;
  private maskData: SurfaceData;

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

  add(...children: (Shape | Group)[]): this {
    super.add(...children);
    const child = children.find(isSurfaceChild);
    const ripple = children.find<Rect>((child): child is Rect =>
      child.hasName('ripple'),
    );
    const box = children.find<Rect>((child): child is Rect =>
      child.hasName('box'),
    );

    if (child) {
      if (this.child) {
        this.child.off(SURFACE_CHANGE_EVENT, this.handleSurfaceChange);
      }
      this.child = child;
      this.child.on(SURFACE_CHANGE_EVENT, this.handleSurfaceChange);
      this.handleSurfaceChange();
    }

    if (box) {
      this.box?.destroy();
      this.box = box;
    }
    if (ripple) {
      this.ripple?.destroy();
      this.ripple = ripple;
    }

    return this;
  }

  public get project(): Project {
    return <Project>this.getStage();
  }

  public *doRipple() {
    if (this.override) return;
    const opaque = parseColor(this.surfaceData.color);
    this.ripple.show();
    this.ripple
      .offsetX(this.surfaceData.width / 2)
      .offsetY(this.surfaceData.height / 2)
      .width(this.surfaceData.width)
      .height(this.surfaceData.height)
      .cornerRadius(this.surfaceData.radius)
      .fill(`rgba(${opaque.r}, ${opaque.g}, ${opaque.b}, ${0.5})`);

    yield* this.project.tween(1, value => {
      const width = this.surfaceData.width + value.easeOutExpo(0, 100);
      const height = this.surfaceData.height + value.easeOutExpo(0, 100);
      const radius = this.surfaceData.radius + value.easeOutExpo(0, 50);

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

  public getChild(): (Shape | Group) & ISurfaceChild {
    return this.child;
  }

  public setOverride(value: boolean) {
    this.override = value;
    this.clipFunc(value ? this.drawMask : null);
    if (!value) this.handleSurfaceChange();
  }

  public getSurfaceData(): SurfaceData {
    return this.surfaceData;
  }

  public setSurfaceData(data: SurfaceData) {
    if (!this.override) return;
    const offset = this.offsetY();
    const newOffset = this.calculateOffset(data);
    const scale = Math.min(1, data.width / this.surfaceData.width);

    this.maskData = data;
    this.maskData.x = -data.width / 2;
    this.maskData.y = -data.height / 2 + offset - newOffset.y;

    this.offsetX(newOffset.x);
    this.child.scaleX(scale);
    this.child.scaleY(scale);

    this.child.position({
      x: 0,
      y: (-this.surfaceData.height * (1 - scale)) / 2,
    });

    this.box
      .offsetX(data.width / 2)
      .offsetY(data.height / 2 - offset + newOffset.y)
      // .absolutePosition(this.surfaceData)
      .width(data.width)
      .height(data.height)
      .cornerRadius(data.radius)
      .fill(data.color);
  }

  private handleSurfaceChange = () => {
    if (this.override) return;
    this.maskData = this.surfaceData = this.child.getSurfaceData();
    this.updateSurface();
  };

  private updateSurface() {
    this.box
      .offsetX(this.surfaceData.width / 2)
      .offsetY(this.surfaceData.height / 2)
      // .absolutePosition(this.surfaceData)
      .width(this.surfaceData.width)
      .height(this.surfaceData.height)
      .cornerRadius(this.surfaceData.radius)
      .fill(this.surfaceData.color);

    this.offset(this.calculateOffset());
  }

  public withOrigin(origin: Origin, action: () => void) {
    const previousOrigin = this.origin();
    this.origin(origin);
    action();
    this.origin(previousOrigin);
  }

  public handleOriginChange() {
    if (!this.surfaceData || this.override) return;
    const previousOffset = this.offset();
    const nextOffset = this.calculateOffset();
    this.offset(nextOffset);
    this.move({
      x: -previousOffset.x + nextOffset.x,
      y: -previousOffset.y + nextOffset.y,
    });
  }

  public calculateOriginDelta(newOrigin: Origin): Vector2d {
    const offset = this.calculateOffset();
    const nextOffset = this.calculateOffset(this.surfaceData, newOrigin);

    return {
      x: -offset.x + nextOffset.x,
      y: -offset.y + nextOffset.y,
    };
  }

  public calculateOffset(surfaceData?: SurfaceData, origin?: Origin): Vector2d {
    surfaceData ??= this.surfaceData;
    origin ??= this.attrs.origin ?? Origin.Middle;
    const width = surfaceData.width / 2;
    const height = surfaceData.height / 2;
    const offset: Vector2d = {x: 0, y: 0};

    if (origin & Direction.Left) {
      offset.x = -width;
    } else if (origin & Direction.Right) {
      offset.x = width;
    }

    if (origin & Direction.Top) {
      offset.y = -height;
    } else if (origin & Direction.Bottom) {
      offset.y = height;
    }

    return offset;
  }

  private drawMask(ctx: CanvasRenderingContext2D) {
    roundRect(
      ctx,
      this.maskData.x,
      this.maskData.y,
      this.maskData.width,
      this.maskData.height,
      this.maskData.radius,
    );
  }

  getClientRect(config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Container;
  }): IRect {
    if (!this.override || !this.maskData) {
      return super.getClientRect(config);
    }

    const position = this.getAbsolutePosition(this.getLayer());
    const scale = this.getAbsoluteScale(this.getLayer());
    const offset = this.calculateOffset(this.maskData);
    offset.x *= scale.x;
    offset.y *= scale.y;

    return {
      x: position.x - offset.x - this.maskData.width * scale.x / 2,
      y: position.y - offset.y - this.maskData.height * scale.y / 2,
      width: this.maskData.width * scale.x,
      height: this.maskData.height * scale.y,
    };
  }

  origin: GetSet<Origin, this>;
}

Surface.prototype.className = 'Surface';
_registerNode(Surface);

Factory.addGetterSetter(
  Surface,
  'origin',
  Origin.Middle,
  undefined,
  Surface.prototype.handleOriginChange,
);
