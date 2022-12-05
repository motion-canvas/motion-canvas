declare module '*.scss?inline' {
  const value: string;
  export = value;
}

declare module '*.html?raw' {
  const value: string;
  export = value;
}
