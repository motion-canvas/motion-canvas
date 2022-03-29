declare module "*.png" {
  const value: import('./components/Sprite').SpriteData;
  export = value;
}

declare module "*.glsl" {
  const value: string;
  export = value;
}

declare module "*.label" {
  const value: Record<string, number>;
  export = value;
}

declare module "*.anim" {
  const value: import('./components/Sprite').SpriteData[];
  export = value;
}