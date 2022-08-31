/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace */
/// <reference types="vite/client" />

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

declare module '*?scene' {
  const value: import('./lib/scenes/Scene').Scene;
  export = value;
}

declare module 'colorjs.io' {
  const noTypesYet: any;
  export default noTypesYet;
}

declare type Callback = (...args: unknown[]) => void;
