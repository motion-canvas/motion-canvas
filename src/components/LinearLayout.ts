import {Group} from 'konva/lib/Group';
import {GetSet, IRect} from 'konva/lib/types';
import {Factory} from 'konva/lib/Factory';
import {Shape} from 'konva/lib/Shape';
import {LayoutGroup, LayoutGroupConfig} from './LayoutGroup';
import {LayoutShape} from './LayoutShape';
import {Center, Origin, Size} from '../types';
import {Container} from 'konva/lib/Container';
import {getClientRect} from "MC/components/ILayoutNode";

export interface LayoutConfig extends LayoutGroupConfig {
  direction?: Center;
}

export class LinearLayout extends LayoutGroup {
  public direction: GetSet<Center, this>;
  private contentSize: Size;

  constructor(config?: LayoutConfig) {
    super(config);
  }

  getLayoutSize(): Size {
    return this.getPadd().expand({
      width: this.contentSize?.width ?? 0,
      height: this.contentSize?.height ?? 0,
    });
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
        (size.width + margin.x) * scale.x,
      );
      this.contentSize.height += (size.height + margin.y) * scale.y;
    }

    let height = this.contentSize.height / -2;
    for (const child of children) {
      const size = child.getLayoutSize();
      const margin = child.getMargin();
      const scale = child.getAbsoluteScale(this);
      const offset = child.getOriginDelta(Origin.Top);

      child.position({
        x: -offset.x * scale.x,
        y: height + (-offset.y + margin.top) * scale.y,
      });
      height += (size.height + margin.y) * scale.y;
    }
    this.offset(this.getOriginOffset());

    this.fireLayoutChange();
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

Factory.addGetterSetter(
  LinearLayout,
  'direction',
  Center.Vertical,
  undefined,
  // @ts-ignore
  LinearLayout.prototype.recalculate,
);
