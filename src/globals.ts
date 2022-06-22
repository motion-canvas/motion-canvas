/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace */

declare module '*.png' {
  const value: string;
  export = value;
}

declare module '*.png?img' {
  const value: Promise<HTMLImageElement>;
  export = value;
}

declare module '*.png?anim' {
  const value: Promise<HTMLImageElement[]>;
  export = value;
}

declare module '*.jpg' {
  const value: string;
  export = value;
}

declare module '*.jpg?img' {
  const value: Promise<HTMLImageElement>;
  export = value;
}

declare module '*.jpg?anim' {
  const value: Promise<HTMLImageElement[]>;
  export = value;
}

declare module '*.jpeg' {
  const value: string;
  export = value;
}

declare module '*.jpeg?img' {
  const value: Promise<HTMLImageElement>;
  export = value;
}

declare module '*.jpeg?anim' {
  const value: Promise<HTMLImageElement[]>;
  export = value;
}

declare module '*.wav' {
  const value: string;
  export = value;
}

declare module '*.mp3' {
  const value: string;
  export = value;
}

declare module '*.ogg' {
  const value: string;
  export = value;
}

declare module '*.mp4' {
  const value: string;
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

declare interface Window {
  player: import('./player/Player').Player;
}

declare namespace NodeJS {
  interface Module {
    parents: string[];
  }
}

declare namespace JSX {
  type ElementClass = import('konva/lib/Node').Node;
  interface ElementChildrenAttribute {
    children: unknown;
  }
}

declare type Callback = (...args: unknown[]) => void;

declare const PROJECT_FILE_NAME: string;

declare const CORE_VERSION: string;

declare const META_VERSION: number;
