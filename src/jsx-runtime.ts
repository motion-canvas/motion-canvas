import {Node} from 'konva/lib/Node';
import {Container} from 'konva/lib/Container';
import {Surface} from './components';
import {LayoutNode} from './components/ILayoutNode';

export const Fragment = Symbol.for('mc.fragment');
export function jsx<TNode extends Node, TConfig>(
  type: new (config?: TConfig) => TNode,
  config: TConfig & {children?: Node | Node[]; ref?: {value: TNode} | [any, string]},
  maybeKey: string,
): TNode {
  const {children, ref, ...rest} = config;
  const node = new type(<TConfig>rest);
  if (children) {
    if (node instanceof Surface) {
      if (Array.isArray(children)) {
        node.setChild(<LayoutNode>children[0]);
      } else {
        node.setChild(<LayoutNode>children);
      }
    } else if (node instanceof Container) {
      if (Array.isArray(children)) {
        node.add(...children);
      } else {
        node.add(children);
      }
    }
  }
  if (ref) {
    if (Array.isArray(ref)) {
      ref[0][ref[1]] = node;
    } else {
      ref.value = node;
    }
  }

  return node;
}
export {jsx as jsxs};
