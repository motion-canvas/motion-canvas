import {
  experimentalLog,
  SignalValue,
  useLogger,
  useScene,
  WebGLConvertible,
} from '@motion-canvas/core';
import {Node} from '../components';

/**
 * Describes a shader program used to apply effects to nodes.
 *
 * @experimental
 */
export interface ShaderConfig {
  /**
   * The source code of the fragment shader.
   *
   * @example
   * ```glsl
   * #version 300 es
   * precision highp float;
   *
   * #include "@motion-canvas/core/shaders/common.glsl"
   *
   * void main() {
   *     out_color = texture(core_source_tx, source_uv);
   * }
   * ```
   */
  fragment: string;

  /**
   * Custom uniforms to be passed to the shader.
   *
   * @remarks
   * The keys of this object will be used as the uniform names.
   * The values can be either a number or an array of numbers.
   * The following table shows how the values will be mapped to GLSL types.
   *
   * | TypeScript                         | GLSL    |
   * | ---------------------------------- | ------- |
   * | `number`                           | `float` |
   * | `[number, number]`                 | `vec2`  |
   * | `[number, number, number]`         | `vec3`  |
   * | `[number, number, number, number]` | `vec4`  |
   *
   * @example
   * ```ts
   * const shader = {
   *   // ...
   *   uniforms: {
   *     my_value: () => 1,
   *     my_vector: [1, 2, 3],
   *   },
   * };
   * ```
   *
   * ```glsl
   * uniform float my_value;
   * uniform vec3 my_vector;
   * ```
   */
  uniforms?: Record<string, SignalValue<number | number[] | WebGLConvertible>>;

  /**
   * A custom hook run before the shader is used.
   *
   * @remarks
   * Gives you low-level access to the WebGL context and the shader program.
   *
   * @param gl - WebGL context.
   * @param program - The shader program.
   */
  setup?: (gl: WebGL2RenderingContext, program: WebGLProgram) => void;

  /**
   * A custom hook run after the shader is used.
   *
   * @remarks
   * Gives you low-level access to the WebGL context and the shader program.
   * Can be used to clean up resources created in the {@link setup} hook.
   *
   * @param gl - WebGL context.
   * @param program - The shader program.
   */
  teardown?: (gl: WebGL2RenderingContext, program: WebGLProgram) => void;
}

export type PossibleShaderConfig =
  | (ShaderConfig | string)[]
  | ShaderConfig
  | string
  | null;

export function parseShader(
  this: Node,
  value: PossibleShaderConfig,
): ShaderConfig[] {
  let result: ShaderConfig[];
  if (!value) {
    result = [];
  } else if (typeof value === 'string') {
    result = [{fragment: value}];
  } else if (Array.isArray(value)) {
    result = value.map(item =>
      typeof item === 'string' ? {fragment: item} : item,
    );
  } else {
    result = [value];
  }

  if (!useScene().experimentalFeatures && result.length > 0) {
    result = [];
    useLogger().log({
      ...experimentalLog(`Node uses experimental shaders.`),
      inspect: this.key,
    });
  }

  return result;
}
