import {Container} from 'konva/lib/Container';
import {Vector2d} from 'konva/lib/types';

export function slide(container: Container, offset: Vector2d): void;
export function slide(container: Container, x: number, y?: number): void;
export function slide(
  container: Container,
  offset: number | Vector2d,
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
