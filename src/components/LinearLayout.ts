import {Group} from 'konva/lib/Group';
import {GetSet, IRect} from 'konva/lib/types';
import {Shape} from 'konva/lib/Shape';
import {LayoutGroup, LayoutGroupConfig} from './LayoutGroup';
import {Center, Origin, Size, Spacing} from '../types';
import {Container} from 'konva/lib/Container';
import {getClientRect, getOriginDelta, isLayoutNode} from "./ILayoutNode";
import {getset, KonvaNode} from "../decorators";

export interface LinearLayoutConfig extends LayoutGroupConfig {
  direction?: Center;
}

@KonvaNode()
export class LinearLayout extends LayoutGroup {
  @getset(Center.Vertical, LinearLayout.prototype.handleLayoutChange)
  public direction: GetSet<Center, this>;

  private contentSize: Size;

  constructor(config?: LinearLayoutConfig) {
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

    for (const child of this.children) {
      const isLayout = isLayoutNode(child);
      const size = isLayout ? child.getLayoutSize() : child.getSize();
      const margin = isLayout ? child.getMargin() : new Spacing();
      const scale = child.getAbsoluteScale(this);
      this.contentSize.width = Math.max(
        this.contentSize.width,
        (size.width + margin.x) * scale.x,
      );
      this.contentSize.height += (size.height + margin.y) * scale.y;
    }

    let height = this.contentSize.height / -2;
    for (const child of this.children) {
      const isLayout = isLayoutNode(child);
      const size = isLayout ? child.getLayoutSize() : child.getSize();
      const margin = isLayout ? child.getMargin() : new Spacing();
      const offset = isLayout ? child.getOriginDelta(Origin.Top) : getOriginDelta(size, Origin.TopLeft, Origin.Top);
      const scale = child.getAbsoluteScale(this);

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
