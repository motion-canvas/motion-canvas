import type {Node} from 'konva/lib/Node';
import {getOriginDelta, Origin} from '../types';
import {useScene} from '../utils';

export function Align(config: {origin?: Origin; children: Node | Node[]}) {
  const scene = useScene();
  const position = getOriginDelta(
    scene.project.getSize(),
    Origin.TopLeft,
    config.origin ?? Origin.Middle,
  );

  if (Array.isArray(config.children)) {
    for (const child of config.children) {
      child.move(position);
    }
  } else {
    config.children.move(position);
  }

  return <>{config.children}</>;
}
