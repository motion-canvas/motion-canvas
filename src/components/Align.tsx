import type {Node} from 'konva/lib/Node';
import {getOriginDelta, Origin} from '../types';
import {useScene} from '../utils';

interface AlignConfig {
  origin?: Origin;
  children: Node | Node[];
}

export function Align(config: AlignConfig) {
  const origin = config.origin ?? Origin.Middle;
  if (origin === Origin.Middle) {
    console.warn(
      '<Align> with origin set to Middle does nothing and can be omitted',
    );
    return <>{config.children}</>;
  }

  const scene = useScene();
  const position = getOriginDelta(scene.getSize(), Origin.Middle, origin);

  if (Array.isArray(config.children)) {
    for (const child of config.children) {
      child.move(position);
    }
  } else {
    config.children.move(position);
  }

  return <>{config.children}</>;
}
