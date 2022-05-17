import {Node} from 'konva/lib/Node';
import {useScene} from './useScene';

export function pop<T extends Node>(node: T): [T, () => void] {
  const clone: T = node.clone();
  clone.moveTo(useScene());
  clone.position(node.absolutePosition());
  node.hide();

  return [
    clone,
    () => {
      clone.destroy();
      node.show();
    },
  ];
}
