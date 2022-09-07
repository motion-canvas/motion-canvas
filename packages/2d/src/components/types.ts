import type {Node} from './Node';
import type {Reference} from '@motion-canvas/core/lib/utils';

export type ComponentChild =
  | Node
  | object
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined;

export type ComponentChildren = ComponentChild | ComponentChild[];
export type NodeChildren = Node | Node[];

export interface JSXProps {
  children?: ComponentChildren;
  ref?: Reference<Node>;
}

export interface FunctionComponent<T = any> {
  (props: T): Node<T> | null;
}

export interface NodeConstructor<T = any> {
  new (props: T): Node<T>;
}
