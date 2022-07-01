import type {Container} from 'konva/lib/Container';
import type {Vector2} from '../types';

export function slide(container: Container, offset: Vector2): void;
export function slide(container: Container, x: number, y?: number): void;
export function slide(
  container: Container,
  offset: number | Vector2,
  y = 0,
): void {
  if (typeof offset === 'number') {
    offset = {x: offset, y};
  } else {
    offset = {...offset};
  }

  container.move(offset);
  offset.x *= -1;
  offset.y *= -1;
  for (const child of container.children) {
    child.move(offset);
  }
}
