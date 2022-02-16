import {Node} from 'konva/lib/Node';
import {Vector2d} from 'konva/lib/types';
import {tween} from '../tweening';

export function move(node: Node, position: Vector2d): Generator;
export function move(
  node: Node,
  positionX: number,
  positionY: number,
): Generator;
export function move(
  node: Node,
  positionX: number | Vector2d,
  positionY?: number,
): Generator {
  const positionFrom = node.position();
  const positionTo =
    typeof positionX === 'number' ? {x: positionX, y: positionY} : positionX;

  const distance = Math.sqrt(
    Math.pow(positionFrom.x - positionTo.x, 2) +
      Math.pow(positionFrom.y - positionTo.y, 2),
  );

  return tween(distance / 1000, value =>
    node.position(value.vector2d(positionFrom, positionTo)),
  );
}
