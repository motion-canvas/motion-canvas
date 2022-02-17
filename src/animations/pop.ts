import {Node} from 'konva/lib/Node';

export function pop<T extends Node>(node: T): [T, () => void] {
  const clone: T = node.clone();
  clone.moveTo(node.getLayer());
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
