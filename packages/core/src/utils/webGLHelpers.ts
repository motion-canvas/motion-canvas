export function compileShader(
  context: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = context.createShader(type)!;

  context.shaderSource(shader, source);
  context.compileShader(shader);

  if (context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    return shader;
  }

  console.warn(context.getShaderInfoLog(shader));
  context.deleteShader(shader);
  return null;
}

export function compileProgram(
  context: WebGL2RenderingContext,
  vs: WebGLShader,
  fs: WebGLShader,
): WebGLProgram | null {
  const program = context.createProgram()!;
  context.attachShader(program, vs);
  context.attachShader(program, fs);
  context.linkProgram(program);

  if (context.getProgramParameter(program, context.LINK_STATUS)) {
    return program;
  }

  console.warn(context.getProgramInfoLog(program));
  return null;
}
