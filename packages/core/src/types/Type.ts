export const EPSILON = 0.000001;

export interface Type {
  toSymbol(): symbol;
}

export interface WebGLConvertible {
  toUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation): void;
}

export function isType(value: any): value is Type {
  return value && typeof value === 'object' && 'toSymbol' in value;
}
