import {Node} from 'konva/lib/Node';
import {Container} from 'konva/lib/Container';

export const Fragment = Symbol.for('mc.fragment');
export function jsx<TNode extends Node, TConfig>(
  type: new (config?: TConfig) => TNode,
  config: TConfig & {children?: Node | Node[], ref?: {value: TNode}},
  maybeKey: string,
): TNode {
  const {children, ref, ...rest} = config;
  const node = new type(<TConfig>rest);
  if (children && node instanceof Container) {
    if (Array.isArray(children)) {
      node.add(...children);
    } else {
      node.add(children);
    }
  }
  if (ref) {
    ref.value = node;
  }

  return node;
}
export {jsx as jsxs};
