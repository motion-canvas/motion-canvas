import type {Node} from 'konva/lib/Node';

export function useRef<T extends Node>(): {value: T} {
  return {value: null};
}
