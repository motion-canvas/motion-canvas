import {
  Size,
  Origin,
  PossibleSpacing,
  Spacing,
  originPosition,
} from '../types';
import {Node} from 'konva/lib/Node';
import {LayoutGroup} from './LayoutGroup';
import {LayoutShape} from './LayoutShape';
import {IRect, Vector2d} from 'konva/lib/types';
import {Shape} from 'konva/lib/Shape';
import {Group} from 'konva/lib/Group';

export const LAYOUT_CHANGE_EVENT = 'layoutChange';

export interface LayoutAttrs {
  margin: PossibleSpacing;
  padd: PossibleSpacing;
  origin: Origin;
}

export interface ILayoutNode {
  getMargin(): Spacing;
  getPadd(): Spacing;
  getOrigin(): Origin;
  getOriginOffset(custom?: Partial<LayoutAttrs>): Vector2d;
  getOriginDelta(newOrigin: Origin, custom?: Partial<LayoutAttrs>): Vector2d;
  getLayoutSize(custom?: Partial<LayoutAttrs>): Size;
}

export type LayoutNode = (Shape | Group) & ILayoutNode;

export function isLayoutNode(node: Node): node is LayoutNode {
  return 'getLayoutSize' in node;
}

export function isInsideLayout(node: Node) {
  let parent = node.getParent();
  let limit = 100;
  while (parent && limit > 0) {
    if (parent instanceof LayoutGroup || parent instanceof LayoutShape)
      return true;
    limit--;
    parent = parent.getParent();
  }

  if (limit <= 0) {
    console.warn('isInsideLayout has reached its limit!');
  }

  return false;
}

export function getOriginOffset(size: Size, origin: Origin): Vector2d {
  return originPosition(origin, size.width / 2, size.height / 2);
}

export function getOriginDelta(size: Size, from: Origin, to: Origin) {
  const fromOffset = getOriginOffset(size, from);
  if (to === Origin.Middle) {
    return {x: -fromOffset.x, y: -fromOffset.y};
  }

  const toOffset = getOriginOffset(size, to);
  return {
    x: toOffset.x - fromOffset.x,
    y: toOffset.y - fromOffset.y,
  };
}

export function getClientRect(
  node: LayoutNode,
  config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Node;
  },
): IRect {
  const size = node.getLayoutSize();
  const offset = node.getOriginOffset({origin: Origin.TopLeft});

  const rect: IRect = {
    x: offset.x,
    y: offset.y,
    width: size.width,
    height: size.height,
  };

  if (!config?.skipTransform) {
    return node._transformedRect(rect, config?.relativeTo);
  }

  return rect;
}
