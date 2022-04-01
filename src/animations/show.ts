import {Node} from 'konva/lib/Node';
import {Surface} from '../components';
import {Origin, originPosition, Spacing} from '../types';
import {chain} from '../flow';
import {Vector2d} from 'konva/lib/types';
import {
  clampRemap,
  easeInExpo,
  easeInOutCubic,
  easeOutExpo,
  linear,
  spacingTween,
  tween,
} from '../tweening';
import {decorate, threadable} from '../decorators';

decorate(showTop, threadable());
export function showTop(node: Node): [Generator, Generator] {
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
export function showSurface(surface: Surface): Generator {
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
        width: easeInOutCubic(value, fromMask.width, toMask.width),
        height: easeInOutCubic(value, fromMask.height, toMask.height),
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
  origin?: Origin | Vector2d,
): Generator {
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
    tween(target / 2000, value => {
      mask.radius = easeInOutCubic(value, 0, target);
    }),
    () => surface.setCircleMask(null),
  );
}
