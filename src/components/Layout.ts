import {Group} from 'konva/lib/Group';
import {Container, ContainerConfig} from 'konva/lib/Container';
import {Center} from 'MC/types/Origin';
import {GetSet, IRect} from 'konva/lib/types';
import {_registerNode} from 'konva/lib/Global';
import {Factory} from 'konva/lib/Factory';
import {ISurfaceChild, Surface, SURFACE_CHANGE_EVENT, SurfaceData} from 'MC/components/Surface';
import {Shape} from 'konva/lib/Shape';
import {getNumberValidator} from 'konva/lib/Validators';

export interface LayoutConfig extends ContainerConfig {
  direction?: Center;
  padding?: number;
}

export class Layout extends Group implements ISurfaceChild {
  public direction: GetSet<Center, this>;
  public padding: GetSet<number, this>;

  constructor(config?: LayoutConfig) {
    super(config);
    this.recalculate();
  }

  private handleChildChange = () => this.recalculate();

  getSurfaceData(): SurfaceData {
    return {
      ...this.getClientRect(),
      color: 'rgba(36, 36, 36, 1)',
      radius: 20,
    };
  }

  add(...children: (Group | Shape)[]): this {
    super.add(...children);
    for (const child of children) {
      child.on(SURFACE_CHANGE_EVENT, this.handleChildChange);
    }
    this.recalculate();
    return this;
  }

  removeChildren(): this {
    for (const child of this.children) {
      child.off(SURFACE_CHANGE_EVENT, this.handleChildChange);
    }
    return super.removeChildren();
  }

  private recalculate() {
    if (!this.children) return;

    const padding = this.attrs.padding ?? 20;
    let height = 0;
    let width = 0;
    if (this.attrs.direction === Center.Horizontal) {
      for (const child of this.children) {
        const rect = child.getClientRect();
        const offset = child instanceof Surface ? child.calculateOffset() : {x: 0, y: 0};
        height = Math.max(height, rect.height);
        width += rect.width / 2;
        child.position({x: width, y: offset.y});
        width += rect.width / 2 + padding;
      }
      this.offsetX((width - padding) / 2);
    } else {
      for (const child of this.children) {
        const rect = child.getClientRect();
        const offset = child instanceof Surface ? child.calculateOffset() : {x: 0, y: 0};
        width = Math.max(width, rect.width);
        height += rect.height / 2;
        child.position({x: offset.x, y: height});
        height += rect.height / 2 + padding;
      }
      this.offsetY((height - padding) / 2);
    }

    this.fire(SURFACE_CHANGE_EVENT, undefined, true);
  }

  getClientRect(config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Container;
  }): IRect {
    const padding = this.attrs.padding ?? 20;
    const rect = super.getClientRect(config);
    rect.x -= padding;
    rect.y -= padding;
    rect.width += padding * 2;
    rect.height += padding * 2;

    return rect;
  }
}

Layout.prototype.className = 'Layout';
_registerNode(Layout);

Factory.addGetterSetter(
  Layout,
  'direction',
  Center.Vertical,
  undefined,
  // @ts-ignore
  Layout.prototype.recalculate,
);
Factory.addGetterSetter(
  Layout,
  'padding',
  20,
  getNumberValidator(),
  // @ts-ignore
  Layout.prototype.recalculate,
);
