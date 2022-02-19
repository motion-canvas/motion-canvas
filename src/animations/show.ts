import {Node} from 'konva/lib/Node';
import {Project} from '../Project';

export function showTop(this: Project, node: Node): [Generator, Generator] {
  const to = node.offsetY();
  const from = to - 40;
  node.offsetY(from);
  node.opacity(0);

  return [
    this.tween(0.5, value => {
      node.opacity(Math.min(1, value.linear(0, 2)));
      node.offsetY(value.easeOutExpo(from, to));
    }),
    this.tween(0.5, value => {
      node.opacity(Math.min(1, value.linear(2, 0)));
      node.offsetY(value.easeInExpo(to, from));
    }),
  ];
}
