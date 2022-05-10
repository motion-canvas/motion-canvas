import type {Scene} from './Scene';
import {Node, NodeConfig} from 'konva/lib/Node';
import {Container} from 'konva/lib/Container';
import {Surface} from './components';
import {LayoutNode} from './components/ILayoutNode';

function isConstructor(fn: Function): fn is new (...args: any[]) => any {
  return !!fn.prototype?.name;
}

export const Fragment = Symbol.for('mc.fragment');
export function jsx(
  type:
    | (new (config?: NodeConfig) => Node)
    | ((config: NodeConfig) => Node)
    | typeof Fragment,
  config: NodeConfig & {
    children?: Node | Node[];
    ref?: {value: Node} | [any, string];
  },
  maybeKey: string,
): Node | Node[] {
  const {children, ref, ...rest} = config;
  const flatChildren = Array.isArray(children) ? children.flat() : [children];

  if (type === Fragment) {
    return flatChildren;
  }

  if (!isConstructor(type)) {
    return type(config);
  }

  const node = new type(rest);
  if (children) {
    if (node instanceof Surface) {
      node.setChild(<LayoutNode>flatChildren[0]);
    } else if (node instanceof Container) {
      node.add(...flatChildren);
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
