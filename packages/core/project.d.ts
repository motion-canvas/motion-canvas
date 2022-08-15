/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace */
/// <reference types="vite/client" />
/// <reference types="@motion-canvas/core/lib/patches/Factory" />
/// <reference types="@motion-canvas/core/lib/patches/Node" />
/// <reference types="@motion-canvas/core/lib/patches/Shape" />
/// <reference types="@motion-canvas/core/lib/patches/Container" />

declare module '*?img' {
  const value: Promise<HTMLImageElement>;
  export = value;
}

declare module '*?anim' {
  const value: Promise<HTMLImageElement[]>;
  export = value;
}

declare module '*.csv' {
  const value: unknown;
  export = value;
}

declare module '*.glsl' {
  const value: string;
  export = value;
}

declare namespace JSX {
  type ElementClass = import('konva/lib/Node').Node;
  interface ElementChildrenAttribute {
    children: unknown;
  }
}

declare module 'colorjs.io' {
  const noTypesYet: any;
  export default noTypesYet;
}

declare type Callback = (...args: unknown[]) => void;

declare const PROJECT_FILE_NAME: string;
