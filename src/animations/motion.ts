import {Node} from 'konva/lib/Node';
import {Vector2d} from 'konva/lib/types';
import {Project} from "../Project";

export function move(
  this: Project,
  node: Node,
  position: Vector2d,
  absolute?: boolean,
): Generator;
export function move(
  this: Project,
  node: Node,
  positionX: number,
  positionY: number,
  absolute?: boolean,
): Generator;
export function move(
  this: Project,
  node: Node,
  arg0: number | Vector2d,
  arg1?: number | boolean,
  arg2?: boolean,
): Generator {
  let delta: Vector2d;
  let absolute: boolean;
  if (typeof arg0 === 'number') {
    delta = {x: arg0, y: <number>arg1};
    absolute = arg2;
  } else {
    delta = arg0;
    absolute = <boolean>arg1;
  }

  const positionFrom = node.position();
  let positionTo = absolute
    ? delta
    : {x: delta.x + positionFrom.x, y: delta.y + positionFrom.y};

  const distance = Math.sqrt(
    Math.pow(positionFrom.x - positionTo.x, 2) +
      Math.pow(positionFrom.y - positionTo.y, 2),
  );

  return this.tween(distance / 1000, value =>
    node.position(value.vector2d(positionFrom, positionTo)),
  );
}
