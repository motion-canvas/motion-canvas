/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace */
/// <reference types="@motion-canvas/core/project" />
/// <reference types="@motion-canvas/legacy/lib/patches/Factory" />
/// <reference types="@motion-canvas/legacy/lib/patches/Node" />
/// <reference types="@motion-canvas/legacy/lib/patches/Shape" />
/// <reference types="@motion-canvas/legacy/lib/patches/Container" />

declare namespace JSX {
  type ElementClass = import('konva/lib/Node').Node;
  interface ElementChildrenAttribute {
    children: unknown;
  }
}
