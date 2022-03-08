import {Node} from 'konva/lib/Node';
import {Project} from '../Project';
import {Surface} from "MC/components/Surface";
import {TimeTween} from "MC/animations/TimeTween";

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
  const margin = surface.getMargin();
  const toMask = surface.getMask();
  const fromMask = {
    ...toMask,
    width: 0,
    height: 0,
  };
  surface.setOverride(true);
  surface.setMargin(0);
  surface.setMask(fromMask)

  return this.tween(0.5, value => {
    surface.setMask(
      {
        ...toMask,
        width: value.easeInOutCubic(fromMask.width, toMask.width),
        height: value.easeInOutCubic(fromMask.height, toMask.height),
      }
    )
    surface.setMargin(value.easeInOutCubic(0, margin));
    surface.opacity(TimeTween.clampRemap(0.3, 1, 0, 1, value.value));
  });
}