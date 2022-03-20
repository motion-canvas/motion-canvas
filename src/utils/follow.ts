import {Node} from 'konva/lib/Node';
import {Center, flipOrigin, Origin} from '../types';
import {getOriginDelta, isLayoutNode} from '../components/ILayoutNode';

export interface FollowSubscription {
  dispose(): void;
  target(newTarget: Node): void;
}

export function follow(
  source: Node,
  target: Node,
  direction?: Origin,
): FollowSubscription {
  direction ??= isLayoutNode(source)
    ? flipOrigin(source.getOrigin(), Center.Vertical)
    : Origin.TopLeft;

  const update = () => {
    const rect = target.getClientRect({relativeTo: target.getLayer()});
    const offset = getOriginDelta(rect, Origin.TopLeft, direction);
    source.position({
      x: rect.x + offset.x,
      y: rect.y + offset.y,
    });
  };

  target.on('absoluteTransformChange', update);
  update();

  return {
    dispose: () => target.off('absoluteTransformChange', update),
    target: (newTarget: Node) => {
      target.off('absoluteTransformChange', update);
      target = newTarget;
      target.on('absoluteTransformChange', update);
      update();
    },
  };
}
