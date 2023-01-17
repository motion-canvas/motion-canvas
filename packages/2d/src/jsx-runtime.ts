import type {
  ComponentChildren,
  FunctionComponent,
  Node,
  NodeConstructor,
  JSXProps,
} from './components';

export namespace JSX {
  export type Element = Node;
  export type ElementClass = Node;
  export interface ElementChildrenAttribute {
    children: any;
  }
}

function isClassComponent(
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
): fn is new (...args: unknown[]) => unknown {
  return !!fn.prototype?.isClass;
}

export const Fragment = Symbol.for('@motion-canvas/2d/fragment');
export function jsx(
  type: NodeConstructor | FunctionComponent | typeof Fragment,
  config: JSXProps,
): ComponentChildren {
  const {ref, children, ...rest} = config;
  const flatChildren = Array.isArray(children) ? children.flat() : children;

  if (type === Fragment) {
    return flatChildren;
  }

  if (isClassComponent(type)) {
    const node = new type({...rest, children: flatChildren});
    ref?.(node);
    return node;
  } else {
    return type({...rest, ref, children: flatChildren});
  }
}
export {jsx as jsxs};
