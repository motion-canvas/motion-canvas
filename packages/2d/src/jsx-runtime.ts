import type {
  ComponentChildren,
  FunctionComponent,
  Node,
  NodeConstructor,
  JSXProps,
} from './components';

// eslint-disable-next-line @typescript-eslint/no-namespace
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

export const Fragment = Symbol.for('MotionCanvas2DFragment');
export function jsx(
  type: NodeConstructor | FunctionComponent | typeof Fragment,
  config: JSXProps,
): ComponentChildren {
  const {ref, children, ...rest} = config;
  const flatChildren = Array.isArray(children) ? children.flat() : [children];

  if (type === Fragment) {
    return flatChildren;
  }

  if (isClassComponent(type)) {
    const node = new type({...rest, children: flatChildren});
    if (ref) {
      ref.value = node;
    }
    return node;
  } else {
    return type({...rest, ref, children: flatChildren});
  }
}
export {jsx as jsxs};
