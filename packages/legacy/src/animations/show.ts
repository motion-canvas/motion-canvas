import type {Node} from 'konva/lib/Node';
import {Surface} from '../components';
import {Origin} from '@motion-canvas/core/lib/types';
import {originPosition} from '../types';
import {all} from '@motion-canvas/core/lib/flow';
import {Vector2d} from 'konva/lib/types';
import {
  easeInOutCubic,
  easeOutCubic,
  easeOutExpo,
  map,
  tween,
} from '@motion-canvas/core/lib/tweening';
import {decorate, threadable} from '@motion-canvas/core/lib/decorators';
import {ThreadGenerator} from '@motion-canvas/core/lib/threading';

decorate(showTop, threadable());
/**
 * Show the given node by sliding it up.
 *
 * @param node - The node to animate.
 */
export function* showTop(node: Node): ThreadGenerator {
  const to = node.offsetY();
  const from = to - 40;
  node.show();
  node.cache();
  node.offsetY(from);
  node.opacity(0);

  yield* all(
    node.opacity(1, 0.5, easeOutExpo),
    node.offsetY(to, 0.5, easeOutExpo),
  );
  node.clearCache();
}

decorate(showSurfaceVertically, threadable());
/**
 * Show the given surface by expanding its mask vertically.
 *
 * @param surface - The surface to animate.
 */
export function* showSurfaceVertically(surface: Surface): ThreadGenerator {
  const mask = surface.getMask();
  surface.show();
  surface.setMask({...mask, height: 0});
  yield* tween(0.5, value => {
    surface.setMask({
      ...mask,
      height: map(0, mask.height, easeOutCubic(value)),
    });
  });
  surface.setMask(null);
}

decorate(showCircle, threadable());
/**
 * Show the given surface using a circle mask.
 *
 * @param surface - The surface to animate.
 * @param duration - The duration of the animation.
 * @param origin - The center of the circle mask.
 */
export function* showCircle(
  surface: Surface,
  duration = 0.6,
  origin?: Origin | Vector2d,
): ThreadGenerator {
  const position =
    typeof origin === 'object'
      ? origin
      : originPosition(origin ?? surface.getOrigin());
  const mask = surface.getAbsoluteCircleMask({
    circleMask: {
      ...position,
      radius: 1,
    },
  });
  surface.show();
  surface.setCircleMask(mask);
  const target = mask.radius;
  mask.radius = 0;

  yield* tween(duration, value => {
    mask.radius = easeInOutCubic(value, 0, target);
  });
  surface.setCircleMask(null);
}
