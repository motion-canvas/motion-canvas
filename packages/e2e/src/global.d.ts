declare namespace jest {
  interface Matchers<R> {
    toMatchImageSnapshot(...args: unknown[]): R;
  }
}

declare module 'jest-image-snapshot' {
  const toMatchImageSnapshot: any;
  export {toMatchImageSnapshot};
}
