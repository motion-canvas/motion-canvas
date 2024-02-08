declare namespace jest {
  interface Matchers<R> {
    toMatchImageSnapshot(): R;
  }
}

declare module 'jest-image-snapshot' {
  const toMatchImageSnapshot: any;
  export {toMatchImageSnapshot};
}
