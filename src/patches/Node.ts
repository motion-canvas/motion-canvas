import {Node} from 'konva/lib/Node';
import {Vector2d} from 'konva/lib/types';
import {Animator} from '../tweening/Animator';
import {ANIMATE} from '../symbols';

const oldPosition = Node.prototype.position;
function patchedPosition(): Vector2d;
function patchedPosition(value: Vector2d): Node;
function patchedPosition(value: typeof ANIMATE): Animator<Vector2d, Node>;
function patchedPosition(value: Vector2d, time: number): Generator;
function patchedPosition(
  value?: Vector2d | typeof ANIMATE,
  time?: number,
): Node | Vector2d | Animator<Vector2d, Node> | Generator {
  if (value === ANIMATE) {
    return new Animator<Vector2d, Node>(this, 'position');
  }
  if (time !== undefined) {
    return new Animator<Vector2d, Node>(this, 'position')
      .key(value, time)
      .run();
  }
  return value === undefined
    ? oldPosition.call(this)
    : oldPosition.call(this, value);
}
Node.prototype.position = patchedPosition;
