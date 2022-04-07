import {Group} from 'konva/lib/Group';
import {GetSet, IRect} from 'konva/lib/types';
import {Shape} from 'konva/lib/Shape';
import {LayoutGroup, LayoutGroupConfig} from './LayoutGroup';
import {Center, Origin, Size, Spacing} from '../types';
import {Container} from 'konva/lib/Container';
import {getClientRect, getOriginDelta, isLayoutNode} from './ILayoutNode';
import {getset, KonvaNode} from '../decorators';

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

    const direction = this.direction();
    this.contentSize = {width: 0, height: 0};

    for (const child of this.children) {
      const isLayout = isLayoutNode(child);
      const size = isLayout ? child.getLayoutSize() : child.getSize();
      const margin = isLayout ? child.getMargin() : new Spacing();
      const scale = child.getAbsoluteScale(this);

      const boxSize = {
        x: (size.width + margin.x) * scale.x,
        y: (size.height + margin.y) * scale.y,
      };

      if (direction === Center.Vertical) {
        this.contentSize.width = Math.max(this.contentSize.width, boxSize.x);
        this.contentSize.height += boxSize.y;
      } else {
        this.contentSize.height = Math.max(this.contentSize.height, boxSize.y);
        this.contentSize.width += boxSize.x;
      }
    }

    let length =
      direction === Center.Vertical
        ? this.contentSize.height / -2
        : this.contentSize.width / -2;

    for (const child of this.children) {
      const isLayout = isLayoutNode(child);
      const size = isLayout ? child.getLayoutSize() : child.getSize();
      const margin = isLayout ? child.getMargin() : new Spacing();
      const scale = child.getAbsoluteScale(this);

      if (direction === Center.Vertical) {
        const offset = isLayout
          ? child.getOriginDelta(Origin.Top)
          : getOriginDelta(size, Origin.TopLeft, Origin.Top);
        child.position({
          x: -offset.x * scale.x,
          y: length + (-offset.y + margin.top) * scale.y,
        });
        length += (size.height + margin.y) * scale.y;
      } else {
        const offset = isLayout
          ? child.getOriginDelta(Origin.Left)
          : getOriginDelta(size, Origin.TopLeft, Origin.Left);
        child.position({
          x: length + (-offset.x + margin.left) * scale.x,
          y: -offset.y * scale.y,
        });
        length += (size.width + margin.x) * scale.x;
      }
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
