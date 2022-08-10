/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace */

declare namespace JSX {
  type ElementClass = import('konva/lib/Node').Node;
  interface ElementChildrenAttribute {
    children: unknown;
  }
}

declare type Callback = (...args: unknown[]) => void;

declare const PROJECT_FILE_NAME: string;

declare module 'colorjs.io' {
  const noTypesYet: any;
  export default noTypesYet;
}
