import {Node} from 'konva/lib/Node';
import {Surface} from '../components';
import {Origin, originPosition, Spacing} from '../types';
import {chain} from '../flow';
import {Vector2d} from 'konva/lib/types';
import {
  clampRemap,
  easeInExpo,
  easeInOutCubic,
  easeOutCubic,
  easeOutExpo,
  linear,
  map,
  rectArcTween,
  spacingTween,
  tween,
} from '../tweening';
import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';

decorate(showTop, threadable());
export function showTop(node: Node): [ThreadGenerator, ThreadGenerator] {
  const to = node.offsetY();
  const from = to - 40;
  node.offsetY(from);
  node.opacity(0);

  return [
    tween(0.5, value => {
      node.opacity(Math.min(1, linear(value, 0, 2)));
      node.offsetY(easeOutExpo(value, from, to));
    }),
    tween(0.5, value => {
      node.opacity(Math.min(1, linear(value, 2, 0)));
      node.offsetY(easeInExpo(value, to, from));
    }),
  ];
}

decorate(showSurface, threadable());
export function showSurface(surface: Surface): ThreadGenerator {
  const marginFrom = new Spacing();
  const margin = surface.getMargin();
  const toMask = surface.getMask();
  const fromMask = {
    ...toMask,
    width: 0,
    height: 0,
  };

  surface.setMargin(0);
  surface.setMask(fromMask);

  return tween(
    0.5,
    value => {
      surface.setMask({
        ...toMask,
        ...rectArcTween(fromMask, toMask, easeInOutCubic(value)),
      });
      surface.setMargin(
        spacingTween(marginFrom, margin, easeInOutCubic(value)),
      );
      surface.opacity(clampRemap(0.3, 1, 0, 1, value));
    },
    () => surface.setMask(null),
  );
}

decorate(showCircle, threadable());
export function showCircle(
  surface: Surface,
  duration: number = 0.6,
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
  surface.setCircleMask(mask);
  const target = mask.radius;
  mask.radius = 0;

  return chain(
    tween(duration, value => {
      mask.radius = easeInOutCubic(value, 0, target);
    }),
    () => surface.setCircleMask(null),
  );
}

export function unravelSurface(surface: Surface): ThreadGenerator {
  const mask = surface.getMask();
  surface.show();
  surface.setMask({...mask, height: 0});
  return tween(
    0.5,
    value => {
      surface.setMask({
        ...mask,
        height: map(0, mask.height, easeOutCubic(value)),
      });
    },
    () => surface.setMask(null),
  );
}
