declare module '*.scss';

declare class EyeDropper {
  public open(): Promise<{sRGBHex: string}>;
}
