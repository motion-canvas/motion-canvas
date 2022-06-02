import {Group} from 'konva/lib/Group';
import {GetSet, IRect} from 'konva/lib/types';
import {Shape} from 'konva/lib/Shape';
import {Center, getOriginOffset, Origin, Size, Spacing} from '../types';
import {Container, ContainerConfig} from 'konva/lib/Container';
import {getset, KonvaNode} from '../decorators';
import {Node} from 'konva/lib/Node';
import {Rect} from 'konva/lib/shapes/Rect';

export interface LinearLayoutConfig extends ContainerConfig {
  direction?: Center;
}

@KonvaNode()
export class LinearLayout extends Group {
  @getset(Center.Vertical, Node.prototype.markDirty)
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
    this.recalculateLayout();
    return this;
  }

  public recalculateLayout() {
    if (!this.children) return;

    const direction = this.direction();
    this.contentSize = {width: 0, height: 0};

    for (const child of this.children) {
      const size = child.getLayoutSize();
      const margin = child.getMargin();
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
      const size = child.getLayoutSize();
      const margin = child.getMargin();
      const scale = child.getAbsoluteScale(this);
      const offset = child.getOriginDelta(Origin.TopLeft);
      const parentOffset = getOriginOffset(
        margin.shrink(this.contentSize),
        child.origin(),
      );
      if (direction === Center.Vertical) {
        child.position({
          x: parentOffset.x,
          y: length + (-offset.y + margin.top) * scale.y,
        });
        length += (size.height + margin.y) * scale.y;
      } else {
        child.position({
          x: length + (-offset.x + margin.left) * scale.x,
          y: parentOffset.y,
        });
        length += (size.width + margin.x) * scale.x;
      }
    }
    super.recalculateLayout();
  }
}
