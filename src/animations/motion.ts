import {Node} from 'konva/lib/Node';
import {Vector2d} from 'konva/lib/types';
import {Project} from "../Project";

export interface MoveConfig {
  absolute?: boolean,
  speed?: number,
}

export function move(
  this: Project,
  node: Node,
  position: Vector2d,
  config?: MoveConfig,
): Generator;
export function move(
  this: Project,
  node: Node,
  positionX: number,
  positionY: number,
  config?: MoveConfig,
): Generator;
export function move(
  this: Project,
  node: Node,
  arg0: number | Vector2d,
  arg1?: number | MoveConfig,
  arg2?: MoveConfig,
): Generator {
  let delta: Vector2d;
  let config: MoveConfig;
  if (typeof arg0 === 'number') {
    delta = {x: arg0, y: <number>arg1};
    config = arg2 ?? {};
  } else {
    delta = arg0;
    config = <MoveConfig>arg1 ?? {};
  }

  const positionFrom = node.position();
  let positionTo = config.absolute
    ? delta
    : {x: delta.x + positionFrom.x, y: delta.y + positionFrom.y};

  const distance = Math.sqrt(
    Math.pow(positionFrom.x - positionTo.x, 2) +
      Math.pow(positionFrom.y - positionTo.y, 2),
  );

  return this.tween(distance / 1000 * (config.speed ?? 1), value =>
    node.position(value.vector2d(positionFrom, positionTo, value.easeInOutQuint())),
  );
}
