import {LayoutGroup, LayoutGroupConfig} from './LayoutGroup';
import {LayoutAttrs} from './ILayoutNode';
import {Size} from '../types';
import {IRect, Vector2d} from 'konva/lib/types';
import {Group} from 'konva/lib/Group';
import {Shape} from 'konva/lib/Shape';
import {Container} from 'konva/lib/Container';

export class LayeredLayout extends LayoutGroup {
  add(...children: (Group | Shape)[]): this {
    super.add(...children);
    this.handleLayoutChange();
    return this;
  }

  protected handleLayoutChange() {
    this.offset(this.getOriginOffset());
    this.fireLayoutChange();
  }

  public getLayoutSize(custom?: Partial<LayoutAttrs>): Size {
    return this.getClientRect({skipTransform: true});
  }

  public getOriginOffset(custom?: LayoutGroupConfig): Vector2d {
    const offset = super.getOriginOffset(custom);
    const rect = this.getClientRect({relativeTo: this});

    return {
      x: offset.x + rect.x + rect.width / 2,
      y: offset.y + rect.y + rect.height / 2,
    };
  }

  getClientRect(config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Container;
  }): IRect {
    const rect = this.getPadd().expand(
      super.getClientRect({
        ...config,
        skipTransform: true,
      }),
    );

    if (!config?.skipTransform) {
      return this._transformedRect(rect, config?.relativeTo);
    }

    return rect;
  }
}
