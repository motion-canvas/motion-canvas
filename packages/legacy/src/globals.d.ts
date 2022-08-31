/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace */
/// <reference types="@motion-canvas/core/project" />

declare namespace JSX {
  type ElementClass = import('konva/lib/Node').Node;
  interface ElementChildrenAttribute {
    children: unknown;
  }
}
