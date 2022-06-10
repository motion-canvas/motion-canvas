/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace */

declare module '*.png' {
  const value: import('./components/Sprite').SpriteData;
  export = value;
}

declare module '*.glsl' {
  const value: string;
  export = value;
}

declare module '*.label' {
  const value: Record<string, number>;
  export = value;
}

declare module '*.anim' {
  const value: import('./components/Sprite').SpriteData[];
  export = value;
}

declare module '*.wav' {
  const value: string;
  export = value;
}

declare module '*.csv' {
  const value: unknown;
  export = value;
}

declare module '*.mp4' {
  const value: string;
  export = value;
}

declare interface Window {
  player: import('./player/Player').Player;
}

declare namespace NodeJS {
  interface Module {
    parents: Record<string, string>;
  }
}

declare namespace JSX {
  type ElementClass = import('konva/lib/Node').Node;
  interface ElementChildrenAttribute {
    children: unknown;
  }
}

declare type Callback = (...args: unknown[]) => void;
