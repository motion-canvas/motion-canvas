import {Node} from 'konva/lib/Node';
import {Project} from '../Project';
import {Surface} from '../components/Surface';
import {TimeTween} from './TimeTween';
import {Origin, originPosition, Spacing} from '../types';
import {chain} from '../flow';
import {Vector2d} from 'konva/lib/types';

export function showTop(this: Project, node: Node): [Generator, Generator] {
  const to = node.offsetY();
  const from = to - 40;
  node.offsetY(from);
  node.opacity(0);

  return [
    this.tween(0.5, value => {
      node.opacity(Math.min(1, value.linear(0, 2)));
      node.offsetY(value.easeOutExpo(from, to));
    }),
    this.tween(0.5, value => {
      node.opacity(Math.min(1, value.linear(2, 0)));
      node.offsetY(value.easeInExpo(to, from));
    }),
  ];
}

export function showSurface(this: Project, surface: Surface): Generator {
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

  return this.tween(0.5, value => {
    surface.setMask({
      ...toMask,
      width: value.easeInOutCubic(fromMask.width, toMask.width),
      height: value.easeInOutCubic(fromMask.height, toMask.height),
    });
    surface.setMargin(
      value.spacing(marginFrom, margin, value.easeInOutCubic()),
    );
    surface.opacity(TimeTween.clampRemap(0.3, 1, 0, 1, value.value));
  });
}

export function showCircle(
  this: Project,
  surface: Surface,
  origin?: Origin | Vector2d,
): Generator {
  const position = typeof origin === 'object' ? origin : originPosition(origin ?? surface.getOrigin());
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
    this.tween(target / 2000, value => {
      mask.radius = value.easeInOutCubic(0, target);
    }),
    () => surface.setCircleMask(null),
  );
}
