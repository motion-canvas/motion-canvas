import {Node} from 'konva/lib/Node';
import {Vector2d} from 'konva/lib/types';
import {decorate, threadable} from '../decorators';
import {tween, easeInOutQuint, vector2dTween} from '../tweening';
import {ThreadGenerator} from '../threading';

export interface MoveConfig {
  absolute?: boolean;
  speed?: number;
}

decorate(move, threadable());
export function move(
  node: Node,
  position: Vector2d,
  config?: MoveConfig,
): ThreadGenerator;
export function move(
  node: Node,
  positionX: number,
  positionY: number,
  config?: MoveConfig,
): ThreadGenerator;
export function move(
  node: Node,
  arg0: number | Vector2d,
  arg1?: number | MoveConfig,
  arg2?: MoveConfig,
): ThreadGenerator {
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

  return tween(config.speed ?? distance / 1000, value =>
    node.position(
      vector2dTween(positionFrom, positionTo, easeInOutQuint(value)),
    ),
  );
}
