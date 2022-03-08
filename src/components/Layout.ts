import {Group} from 'konva/lib/Group';
import {GetSet} from 'konva/lib/types';
import {_registerNode} from 'konva/lib/Global';
import {Factory} from 'konva/lib/Factory';
import {Shape} from 'konva/lib/Shape';
import {LayoutGroup, LayoutGroupConfig} from './LayoutGroup';
import {LayoutShape} from './LayoutShape';
import {Center, Origin, Size} from '../types';

export interface LayoutConfig extends LayoutGroupConfig {
  direction?: Center;
}

export class Layout extends LayoutGroup {
  public direction: GetSet<Center, this>;
  private contentSize: Size;

  constructor(config?: LayoutConfig) {
    super(config);
  }

  getLayoutSize(): Size {
    return {
      width: (this.contentSize?.width ?? 0) + this.getPadding() * 2,
      height: (this.contentSize?.height ?? 0) + this.getPadding() * 2,
    };
  }

  //TODO Recalculate upon removing children as well.
  add(...children: (Group | Shape)[]): this {
    super.add(...children);
    this.handleLayoutChange();
    return this;
  }

  protected handleLayoutChange() {
    if (!this.children) return;

    this.contentSize = {width: 0, height: 0};
    const children = this.children.filter<LayoutGroup | LayoutShape>(
      (child): child is LayoutGroup | LayoutShape =>
        child instanceof LayoutGroup || child instanceof LayoutShape,
    );

    for (const child of children) {
      const size = child.getLayoutSize();
      const margin = child.getMargin();
      const scale = child.getAbsoluteScale(this);
      this.contentSize.width = Math.max(
        this.contentSize.width,
        (size.width + margin * 2) * scale.x,
      );
      this.contentSize.height += (size.height + margin * 2) * scale.y;
    }

    let height = this.contentSize.height / -2;
    for (const child of children) {
      const size = child.getLayoutSize();
      const margin = child.getMargin();
      const scale = child.getAbsoluteScale(this);
      const offset = child.getOriginDelta(Origin.Top);

      child.position({
        x: -offset.x * scale.x,
        y: height + (-offset.y + margin) * scale.y,
      });
      height += (size.height + margin * 2) * scale.y;
    }
    this.offset(this.getOriginOffset());

    this.fireLayoutChange();
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
