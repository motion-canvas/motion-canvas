import {Group} from 'konva/lib/Group';
import {Container, ContainerConfig} from 'konva/lib/Container';
import {Center} from '../types/Origin';
import {GetSet, IRect} from 'konva/lib/types';
import {_registerNode} from 'konva/lib/Global';
import {Factory} from 'konva/lib/Factory';
import {
  ISurfaceChild,
  Surface,
  SURFACE_CHANGE_EVENT,
  SurfaceData,
} from './Surface';
import {Shape} from 'konva/lib/Shape';
import {getNumberValidator, getStringValidator} from 'konva/lib/Validators';

export interface LayoutConfig extends ContainerConfig {
  direction?: Center;
  padding?: number;
  background?: string;
}

export class Layout extends Group implements ISurfaceChild {
  public direction: GetSet<Center, this>;
  public padding: GetSet<number, this>;
  public background: GetSet<string, this>;

  private contentSize = {width: 0, height: 0};

  constructor(config?: LayoutConfig) {
    super(config);
    this.recalculate();
  }

  private handleChildChange = () => this.recalculate();

  getSurfaceData(): SurfaceData {
    return {
      ...this.getClientRect({relativeTo: this.getLayer()}),
      color: this.background(),
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
    this.contentSize.height = 0;
    this.contentSize.width = 0;
    if (this.attrs.direction === Center.Horizontal) {
      for (const child of this.children) {
        const rect = child.getClientRect({relativeTo: child.getLayer()});
        const offset =
          child instanceof Surface ? child.calculateOffset() : {x: 0, y: 0};
        this.contentSize.height = Math.max(this.contentSize.height, rect.height);
        this.contentSize.width += rect.width / 2;
        child.position({x: this.contentSize.width, y: offset.y});
        this.contentSize.width += rect.width / 2 + padding;
      }
      this.contentSize.width -= padding;
      this.offsetX((this.contentSize.width) / 2);
    } else {
      for (const child of this.children) {
        const rect = child.getClientRect({relativeTo: child.getLayer()});
        const offset =
          child instanceof Surface ? child.calculateOffset() : {x: 0, y: 0};
        this.contentSize.width = Math.max(this.contentSize.width, rect.width);
        this.contentSize.height += rect.height / 2;
        child.position({x: offset.x, y: this.contentSize.height});
        this.contentSize.height += rect.height / 2 + padding;
      }
      this.contentSize.height -= padding;
      this.offsetY((this.contentSize.height) / 2);
    }

    this.fire(SURFACE_CHANGE_EVENT, undefined, true);
  }

  getClientRect(config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Container;
  }): IRect {
    const padding = this.padding();
    const position = this.getAbsolutePosition(config?.relativeTo);
    const scale = this.getAbsoluteScale(config?.relativeTo);
    const size = {
      width: (this.contentSize.width + padding * 2) * scale.x,
      height: (this.contentSize.height + padding * 2) * scale.y,
    };

    return {
      x: position.x - size.width / 2,
      y: position.y - size.height / 2,
      width: size.width,
      height: size.height,
    };
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
Factory.addGetterSetter(Layout, 'background', '#242424', getStringValidator());
