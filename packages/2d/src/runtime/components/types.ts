import type {ReferenceReceiver} from '@motion-canvas/core';
import type {Node} from './Node';

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

export type PropsOf<T> = T extends NodeConstructor<infer P>
  ? P
  : T extends FunctionComponent<infer P>
    ? P
    : never;

export interface JSXProps {
  children?: ComponentChildren;
  ref?: ReferenceReceiver<Node>;
}

export interface FunctionComponent<T = any> {
  (props: T): Node | null;
}

export interface NodeConstructor<TProps = any, TNode = Node> {
  new (props: TProps): TNode;
}
